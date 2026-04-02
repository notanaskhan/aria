import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from aria_api.db.base import get_db
from aria_api.models import Subscription, SubscriptionPlan, Tenant
from aria_api.middleware.auth import get_current_tenant
from aria_api.config import get_settings

router = APIRouter()
settings = get_settings()


class CheckoutRequest(BaseModel):
    plan: SubscriptionPlan
    success_url: str
    cancel_url: str


@router.post("/checkout")
async def create_checkout(
    data: CheckoutRequest,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    stripe.api_key = settings.stripe_secret_key

    price_map = {
        SubscriptionPlan.starter: settings.stripe_price_starter,
        SubscriptionPlan.growth: settings.stripe_price_growth,
        SubscriptionPlan.enterprise: settings.stripe_price_enterprise,
    }
    price_id = price_map.get(data.plan)
    if not price_id:
        raise HTTPException(status_code=400, detail="Invalid plan")

    if not tenant.stripe_customer_id:
        customer = stripe.Customer.create(
            metadata={"tenant_id": str(tenant.id), "tenant_slug": tenant.slug}
        )
        tenant.stripe_customer_id = customer.id
        await db.commit()

    session = stripe.checkout.Session.create(
        customer=tenant.stripe_customer_id,
        line_items=[{"price": price_id, "quantity": 1}],
        mode="subscription",
        success_url=data.success_url,
        cancel_url=data.cancel_url,
        metadata={"tenant_id": str(tenant.id)},
    )

    return {"checkout_url": session.url}


@router.post("/portal")
async def create_portal(
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    if not tenant.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No billing account found")

    stripe.api_key = settings.stripe_secret_key
    session = stripe.billing_portal.Session.create(
        customer=tenant.stripe_customer_id,
        return_url=f"https://app.aria.ai/dashboard/billing",
    )
    return {"portal_url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    stripe.api_key = settings.stripe_secret_key
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event.type == "checkout.session.completed":
        session = event.data.object
        tenant_id = session.metadata.get("tenant_id")
        if tenant_id:
            result = await db.execute(select(Subscription).where(
                Subscription.tenant_id == tenant_id
            ))
            sub = result.scalar_one_or_none()
            if sub:
                sub.stripe_subscription_id = session.subscription
                sub.status = "active"
                await db.commit()

    elif event.type in ("customer.subscription.updated", "customer.subscription.deleted"):
        stripe_sub = event.data.object
        result = await db.execute(select(Subscription).where(
            Subscription.stripe_subscription_id == stripe_sub.id
        ))
        sub = result.scalar_one_or_none()
        if sub:
            sub.status = stripe_sub.status
            await db.commit()

    return {"received": True}


@router.get("/subscription")
async def get_subscription(
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(Subscription).where(Subscription.tenant_id == tenant.id)
    )
    sub = result.scalar_one_or_none()
    if not sub:
        return {"plan": "free", "status": "active", "usage_count": 0, "conversation_limit": 100}

    return {
        "plan": sub.plan,
        "status": sub.status,
        "usage_count": sub.usage_count,
        "conversation_limit": sub.conversation_limit,
        "employee_limit": sub.employee_limit,
        "current_period_end": sub.current_period_end,
    }
