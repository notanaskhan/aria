from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from aria_api.db.base import get_db
from aria_api.models import Conversation, Message, Employee, ConversationStatus
from aria_api.middleware.auth import get_current_tenant

router = APIRouter()


class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: str

    model_config = {"from_attributes": True}


class ConversationResponse(BaseModel):
    id: UUID
    channel: str
    status: ConversationStatus
    created_at: str
    message_count: Optional[int] = 0

    model_config = {"from_attributes": True}


@router.get("/")
async def list_conversations(
    employee_id: UUID | None = Query(default=None),
    status: ConversationStatus | None = Query(default=None),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0),
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    emp_ids_result = await db.execute(
        select(Employee.id).where(Employee.tenant_id == tenant.id)
    )
    emp_ids = [r[0] for r in emp_ids_result.all()]

    query = select(Conversation).where(Conversation.employee_id.in_(emp_ids))

    if employee_id:
        if employee_id not in emp_ids:
            raise HTTPException(status_code=403, detail="Access denied")
        query = query.where(Conversation.employee_id == employee_id)

    if status:
        query = query.where(Conversation.status == status)

    query = query.order_by(Conversation.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{conversation_id}/messages")
async def get_messages(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(Conversation).join(Employee).where(
            Conversation.id == conversation_id,
            Employee.tenant_id == tenant.id,
        )
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    msgs_result = await db.execute(
        select(Message).where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    )
    return msgs_result.scalars().all()


@router.post("/{conversation_id}/resolve")
async def resolve_conversation(
    conversation_id: UUID,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    from datetime import datetime, timezone
    result = await db.execute(
        select(Conversation).join(Employee).where(
            Conversation.id == conversation_id,
            Employee.tenant_id == tenant.id,
        )
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    conv.status = ConversationStatus.resolved
    conv.resolved_at = datetime.now(timezone.utc)
    await db.commit()
    return {"ok": True}
