import asyncio
import json
import time
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from aria_api.db.base import get_db
from aria_api.models import Employee, Conversation, Message, MessageRole, ConversationStatus
from aria_api.services.agent_runner import run_agent_stream
from aria_api.middleware.auth import get_employee_by_public_key

router = APIRouter()


class ChatMessage(BaseModel):
    content: str
    session_id: str | None = None


@router.post("/{employee_id}")
async def chat_with_employee(
    employee_id: UUID,
    message: ChatMessage,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """SSE streaming chat endpoint for the web widget."""
    result = await db.execute(
        select(Employee).where(Employee.id == employee_id)
    )
    employee = result.scalar_one_or_none()
    if not employee or employee.status.value != "active":
        raise HTTPException(status_code=404, detail="Employee not found or inactive")

    conversation = Conversation(
        employee_id=employee.id,
        channel="web",
        external_user_id=message.session_id,
        status=ConversationStatus.open,
    )
    db.add(conversation)

    user_msg = Message(
        conversation_id=conversation.id,
        role=MessageRole.user,
        content=message.content,
    )
    db.add(user_msg)
    await db.commit()
    await db.refresh(conversation)

    async def event_stream():
        full_response = []
        start_time = time.monotonic()

        try:
            async for token in run_agent_stream(employee, message.content, conversation.id):
                if token.get("type") == "token":
                    full_response.append(token["content"])
                    yield f"data: {json.dumps(token)}\n\n"
                elif token.get("type") in ("escalation", "done", "error"):
                    yield f"data: {json.dumps(token)}\n\n"

            latency = int((time.monotonic() - start_time) * 1000)
            assistant_content = "".join(full_response)

            async with db.begin():
                assistant_msg = Message(
                    conversation_id=conversation.id,
                    role=MessageRole.assistant,
                    content=assistant_content,
                    latency_ms=latency,
                )
                db.add(assistant_msg)

        except asyncio.CancelledError:
            pass
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
