from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from aria_api.db.base import get_db
from aria_api.models import Employee, EmployeeRoleType, EmployeeStatus, Subscription
from aria_api.middleware.auth import get_current_tenant

router = APIRouter()


class EmployeeCreate(BaseModel):
    name: str
    role_type: EmployeeRoleType
    persona_prompt: Optional[str] = None
    llm_model: str = "gpt-4o-mini"
    guardrails_enabled: bool = True
    hitl_enabled: bool = True


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    persona_prompt: Optional[str] = None
    llm_model: Optional[str] = None
    guardrails_enabled: Optional[bool] = None
    hitl_enabled: Optional[bool] = None
    status: Optional[EmployeeStatus] = None


class EmployeeResponse(BaseModel):
    id: UUID
    tenant_id: UUID
    name: str
    role_type: EmployeeRoleType
    persona_prompt: Optional[str]
    llm_model: str
    guardrails_enabled: bool
    hitl_enabled: bool
    status: EmployeeStatus

    model_config = {"from_attributes": True}


@router.get("/", response_model=list[EmployeeResponse])
async def list_employees(
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(Employee).where(Employee.tenant_id == tenant.id)
    )
    return result.scalars().all()


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    data: EmployeeCreate,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    sub_result = await db.execute(
        select(Subscription).where(Subscription.tenant_id == tenant.id)
    )
    subscription = sub_result.scalar_one_or_none()

    emp_result = await db.execute(
        select(Employee).where(Employee.tenant_id == tenant.id)
    )
    current_count = len(emp_result.scalars().all())

    if subscription and current_count >= subscription.employee_limit:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Plan limit reached. Upgrade to add more AI employees.",
        )

    employee = Employee(
        tenant_id=tenant.id,
        **data.model_dump(),
    )
    db.add(employee)
    await db.commit()
    await db.refresh(employee)
    return employee


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: UUID,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(Employee).where(Employee.id == employee_id, Employee.tenant_id == tenant.id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.patch("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: UUID,
    data: EmployeeUpdate,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(Employee).where(Employee.id == employee_id, Employee.tenant_id == tenant.id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(employee, field, value)

    await db.commit()
    await db.refresh(employee)
    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: UUID,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(Employee).where(Employee.id == employee_id, Employee.tenant_id == tenant.id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    await db.delete(employee)
    await db.commit()
