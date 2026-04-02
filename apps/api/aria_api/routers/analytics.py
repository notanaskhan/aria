from uuid import UUID
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
from aria_api.db.base import get_db
from aria_api.models import Conversation, ConversationStatus, Message, Employee, AnalyticsEvent
from aria_api.middleware.auth import get_current_tenant

router = APIRouter()


@router.get("/overview")
async def get_analytics_overview(
    days: int = Query(default=30, ge=1, le=90),
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    since = datetime.now(timezone.utc) - timedelta(days=days)

    emp_ids_result = await db.execute(
        select(Employee.id).where(Employee.tenant_id == tenant.id)
    )
    emp_ids = [r[0] for r in emp_ids_result.all()]

    if not emp_ids:
        return {
            "total_conversations": 0,
            "resolved": 0,
            "escalated": 0,
            "resolution_rate": 0,
            "escalation_rate": 0,
            "avg_messages_per_conversation": 0,
        }

    conv_result = await db.execute(
        select(
            func.count(Conversation.id).label("total"),
            func.sum(case((Conversation.status == ConversationStatus.resolved, 1), else_=0)).label("resolved"),
            func.sum(case((Conversation.status == ConversationStatus.escalated, 1), else_=0)).label("escalated"),
        ).where(
            Conversation.employee_id.in_(emp_ids),
            Conversation.created_at >= since,
        )
    )
    row = conv_result.one()
    total = row.total or 0
    resolved = row.resolved or 0
    escalated = row.escalated or 0

    return {
        "total_conversations": total,
        "resolved": resolved,
        "escalated": escalated,
        "resolution_rate": round(resolved / total * 100, 1) if total > 0 else 0,
        "escalation_rate": round(escalated / total * 100, 1) if total > 0 else 0,
        "period_days": days,
    }


@router.get("/conversations/timeseries")
async def get_conversation_timeseries(
    days: int = Query(default=30, ge=1, le=90),
    employee_id: UUID | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    since = datetime.now(timezone.utc) - timedelta(days=days)

    query = (
        select(
            func.date_trunc("day", Conversation.created_at).label("day"),
            func.count(Conversation.id).label("count"),
        )
        .join(Employee)
        .where(
            Employee.tenant_id == tenant.id,
            Conversation.created_at >= since,
        )
        .group_by(func.date_trunc("day", Conversation.created_at))
        .order_by(func.date_trunc("day", Conversation.created_at))
    )

    if employee_id:
        query = query.where(Conversation.employee_id == employee_id)

    result = await db.execute(query)
    rows = result.all()

    return [{"day": row.day.isoformat(), "count": row.count} for row in rows]
