from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from aria_api.db.base import get_db
from aria_api.models import Employee, KnowledgeSource, KnowledgeSourceType, KnowledgeSourceStatus
from aria_api.middleware.auth import get_current_tenant
from aria_api.workers.knowledge import ingest_url_task, ingest_file_task

router = APIRouter()


class URLIngestRequest(BaseModel):
    employee_id: UUID
    url: str


class KnowledgeSourceResponse(BaseModel):
    id: UUID
    employee_id: UUID
    source_type: KnowledgeSourceType
    source_url: Optional[str]
    file_name: Optional[str]
    chunk_count: int
    status: KnowledgeSourceStatus

    model_config = {"from_attributes": True}


@router.post("/ingest-url", response_model=KnowledgeSourceResponse, status_code=status.HTTP_202_ACCEPTED)
async def ingest_url(
    data: URLIngestRequest,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(Employee).where(Employee.id == data.employee_id, Employee.tenant_id == tenant.id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    source = KnowledgeSource(
        employee_id=employee.id,
        source_type=KnowledgeSourceType.url,
        source_url=str(data.url),
        status=KnowledgeSourceStatus.pending,
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)

    ingest_url_task.delay(str(source.id), str(data.url), employee.chroma_collection_name)

    return source


@router.post("/ingest-file", response_model=KnowledgeSourceResponse, status_code=status.HTTP_202_ACCEPTED)
async def ingest_file(
    employee_id: UUID = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(Employee).where(Employee.id == employee_id, Employee.tenant_id == tenant.id)
    )
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    allowed_types = {"application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    if file.size and file.size > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be under 20MB")

    file_bytes = await file.read()

    source = KnowledgeSource(
        employee_id=employee.id,
        source_type=KnowledgeSourceType.pdf if file.content_type == "application/pdf" else KnowledgeSourceType.docx,
        file_name=file.filename,
        file_size_bytes=len(file_bytes),
        status=KnowledgeSourceStatus.pending,
    )
    db.add(source)
    await db.commit()
    await db.refresh(source)

    ingest_file_task.delay(str(source.id), file_bytes, file.filename, employee.chroma_collection_name)

    return source


@router.get("/{employee_id}/sources", response_model=list[KnowledgeSourceResponse])
async def list_sources(
    employee_id: UUID,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(Employee).where(Employee.id == employee_id, Employee.tenant_id == tenant.id)
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Employee not found")

    sources_result = await db.execute(
        select(KnowledgeSource).where(KnowledgeSource.employee_id == employee_id)
    )
    return sources_result.scalars().all()


@router.delete("/sources/{source_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_source(
    source_id: UUID,
    db: AsyncSession = Depends(get_db),
    tenant=Depends(get_current_tenant),
):
    result = await db.execute(
        select(KnowledgeSource)
        .join(Employee)
        .where(KnowledgeSource.id == source_id, Employee.tenant_id == tenant.id)
    )
    source = result.scalar_one_or_none()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")
    await db.delete(source)
    await db.commit()
