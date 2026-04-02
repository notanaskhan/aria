"""Dynamic webhook receivers for all channels.

Each tenant's channel registers a route at:
  POST /webhooks/{tenant_slug}/{channel_type}
"""
from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends
from aria_api.db.base import get_db
from aria_api.models import Employee, ChannelConfig, ChannelType
from aria_api.services.channel_dispatcher import dispatch_channel_message

router = APIRouter()


@router.post("/{tenant_slug}/{channel_type}")
async def receive_webhook(
    tenant_slug: str,
    channel_type: str,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    try:
        ch_type = ChannelType(channel_type)
    except ValueError:
        raise HTTPException(status_code=404, detail="Unknown channel type")

    body = await request.body()
    headers = dict(request.headers)

    background_tasks.add_task(
        dispatch_channel_message,
        tenant_slug=tenant_slug,
        channel_type=ch_type,
        body=body,
        headers=headers,
    )

    return {"ok": True}


@router.get("/{tenant_slug}/whatsapp")
async def whatsapp_verify(
    request: Request,
):
    """WhatsApp webhook verification handshake."""
    from aria_api.config import get_settings
    settings = get_settings()
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")

    if mode == "subscribe" and token == settings.whatsapp_verify_token:
        return int(challenge)
    raise HTTPException(status_code=403, detail="Verification failed")
