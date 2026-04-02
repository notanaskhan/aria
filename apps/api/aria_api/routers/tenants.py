from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import re
from aria_api.db.base import get_db
from aria_api.models import Tenant, User, UserRole, Subscription, SubscriptionPlan, SubscriptionStatus
from aria_api.middleware.auth import get_current_tenant

router = APIRouter()


class TenantCreate(BaseModel):
    name: str
    clerk_user_id: str
    email: str


class TenantResponse(BaseModel):
    id: str
    name: str
    slug: str
    is_active: bool

    model_config = {"from_attributes": True}


def slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug[:50]


@router.post("/onboard", response_model=TenantResponse, status_code=status.HTTP_201_CREATED)
async def onboard_tenant(data: TenantCreate, db: AsyncSession = Depends(get_db)):
    """Called after Clerk sign-up to create tenant + owner user + free subscription."""
    base_slug = slugify(data.name)
    slug = base_slug
    counter = 1
    while True:
        existing = await db.execute(select(Tenant).where(Tenant.slug == slug))
        if not existing.scalar_one_or_none():
            break
        slug = f"{base_slug}-{counter}"
        counter += 1

    tenant = Tenant(name=data.name, slug=slug)
    db.add(tenant)
    await db.flush()

    user = User(
        tenant_id=tenant.id,
        email=data.email,
        clerk_user_id=data.clerk_user_id,
        role=UserRole.owner,
    )
    db.add(user)

    subscription = Subscription(
        tenant_id=tenant.id,
        plan=SubscriptionPlan.free,
        status=SubscriptionStatus.active,
        conversation_limit=100,
    )
    db.add(subscription)

    await db.commit()
    await db.refresh(tenant)
    return tenant


@router.get("/me", response_model=TenantResponse)
async def get_my_tenant(tenant=Depends(get_current_tenant)):
    return tenant
