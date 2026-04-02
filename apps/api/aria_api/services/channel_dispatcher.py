"""Routes incoming channel webhooks to the correct employee's agent."""
import json
from aria_api.models import ChannelType, Employee, ChannelConfig, Tenant


async def dispatch_channel_message(
    tenant_slug: str,
    channel_type: ChannelType,
    body: bytes,
    headers: dict,
):
    from aria_api.db.base import AsyncSessionLocal
    from sqlalchemy import select

    async with AsyncSessionLocal() as db:
        tenant_result = await db.execute(
            select(Tenant).where(Tenant.slug == tenant_slug)
        )
        tenant = tenant_result.scalar_one_or_none()
        if not tenant:
            return

        channel_result = await db.execute(
            select(ChannelConfig)
            .join(Employee)
            .where(
                Employee.tenant_id == tenant.id,
                ChannelConfig.channel_type == channel_type,
                ChannelConfig.status == "active",
            )
        )
        channel = channel_result.scalar_one_or_none()
        if not channel:
            return

        employee_result = await db.execute(
            select(Employee).where(Employee.id == channel.employee_id)
        )
        employee = employee_result.scalar_one_or_none()
        if not employee or employee.status.value != "active":
            return

        payload = json.loads(body)

        if channel_type == ChannelType.slack:
            await _handle_slack(employee, channel, payload, headers, db)
        elif channel_type == ChannelType.whatsapp:
            await _handle_whatsapp(employee, channel, payload, headers, db)
        elif channel_type == ChannelType.email:
            await _handle_email(employee, channel, payload, headers, db)


async def _handle_slack(employee, channel, payload, headers, db):
    from aria_api.services.agent_runner import run_agent_stream
    from aria_api.services.encryption import decrypt
    from aria_api.models import Conversation, Message, MessageRole, ConversationStatus
    import json

    if payload.get("type") == "url_verification":
        return

    event = payload.get("event", {})
    if event.get("type") != "message" or event.get("bot_id"):
        return

    user_text = event.get("text", "")
    user_id = event.get("user")
    thread_ts = event.get("thread_ts") or event.get("ts")

    conversation = Conversation(
        employee_id=employee.id,
        channel="slack",
        external_user_id=user_id,
        external_thread_id=thread_ts,
        status=ConversationStatus.open,
    )
    db.add(conversation)

    user_msg = Message(
        conversation_id=conversation.id,
        role=MessageRole.user,
        content=user_text,
    )
    db.add(user_msg)
    await db.commit()

    full_response = []
    async for token in run_agent_stream(employee, user_text, conversation.id):
        if token.get("type") == "token":
            full_response.append(token["content"])

    response_text = "".join(full_response)

    creds = json.loads(decrypt(channel.credentials_encrypted))
    bot_token = creds.get("bot_token")

    import httpx
    async with httpx.AsyncClient() as client:
        await client.post(
            "https://slack.com/api/chat.postMessage",
            headers={"Authorization": f"Bearer {bot_token}"},
            json={
                "channel": event.get("channel"),
                "text": response_text,
                "thread_ts": thread_ts,
            },
        )


async def _handle_whatsapp(employee, channel, payload, headers, db):
    """WhatsApp Cloud API message handler."""
    from aria_api.services.agent_runner import run_agent_stream
    from aria_api.services.encryption import decrypt
    from aria_api.models import Conversation, Message, MessageRole, ConversationStatus
    import json

    entry = payload.get("entry", [{}])[0]
    changes = entry.get("changes", [{}])[0]
    value = changes.get("value", {})
    messages = value.get("messages", [])

    if not messages:
        return

    msg = messages[0]
    user_phone = msg.get("from")
    user_text = msg.get("text", {}).get("body", "")
    wa_msg_id = msg.get("id")

    conversation = Conversation(
        employee_id=employee.id,
        channel="whatsapp",
        external_user_id=user_phone,
        external_thread_id=wa_msg_id,
        status=ConversationStatus.open,
    )
    db.add(conversation)
    db.add(Message(conversation_id=conversation.id, role=MessageRole.user, content=user_text))
    await db.commit()

    full_response = []
    async for token in run_agent_stream(employee, user_text, conversation.id):
        if token.get("type") == "token":
            full_response.append(token["content"])

    response_text = "".join(full_response)
    creds = json.loads(decrypt(channel.credentials_encrypted))

    import httpx
    async with httpx.AsyncClient() as client:
        await client.post(
            f"https://graph.facebook.com/v19.0/{creds['phone_number_id']}/messages",
            headers={"Authorization": f"Bearer {creds['access_token']}"},
            json={
                "messaging_product": "whatsapp",
                "to": user_phone,
                "type": "text",
                "text": {"body": response_text},
            },
        )


async def _handle_email(employee, channel, payload, headers, db):
    """Basic email webhook handler (SendGrid inbound parse)."""
    pass
