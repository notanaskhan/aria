from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from aria_api.db.base import get_db
from aria_api.models import Employee, ChannelConfig, ChannelType, ChannelStatus
from aria_api.middleware.auth import get_current_tenant
from aria_api.services.encryption import encrypt, decrypt

router = APIRouter()


class ChannelConnect(BaseModel):
    employee_id: UUID
    channel_type: ChannelType
    credentials: dict


class ChannelResponse(BaseModel):
    id: UUID
    employee_id: UUID
    channel_type: ChannelType
    status: ChannelStatus
    webhook_url: Optional[str]

    model_config = {"from_attributes": True}


@router.post("/connect", response_model=ChannelResponse, status_code=status.HTTP_201_CREATED)
async def connect_channel(
    data: ChannelConnect,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(Employee).where(Employee.id == data.employee_id, Employee.tenant_id == tenant.id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    existing = await db.execute(
        select(ChannelConfig).where(
            ChannelConfig.employee_id == data.employee_id,
            ChannelConfig.channel_type == data.channel_type,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Channel already connected")

    import json
    encrypted_creds = encrypt(json.dumps(data.credentials))

    webhook_url = f"https://api.aria.ai/api/v1/webhooks/{tenant.slug}/{data.channel_type.value}"

    channel = ChannelConfig(
        employee_id=data.employee_id,
        channel_type=data.channel_type,
        credentials_encrypted=encrypted_creds,
        webhook_url=webhook_url,
        status=ChannelStatus.active,
    )
    db.add(channel)
    await db.commit()
    await db.refresh(channel)
    return channel


@router.delete("/{channel_id}", status_code=status.HTTP_204_NO_CONTENT)
async def disconnect_channel(
    channel_id: UUID,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(ChannelConfig)
        .join(Employee)
        .where(ChannelConfig.id == channel_id, Employee.tenant_id == tenant.id)
    )
    channel = result.scalar_one_or_none()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    await db.delete(channel)
    await db.commit()
