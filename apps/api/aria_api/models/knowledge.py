import uuid
import enum
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Text, Integer, func, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from aria_api.db.base import Base


class KnowledgeSourceType(str, enum.Enum):
    url = "url"
    pdf = "pdf"
    docx = "docx"
    notion = "notion"
    confluence = "confluence"
    google_drive = "google_drive"
    text = "text"


class KnowledgeSourceStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    indexed = "indexed"
    failed = "failed"


class KnowledgeSource(Base):
    __tablename__ = "knowledge_sources"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True
    )
    source_type: Mapped[KnowledgeSourceType] = mapped_column(SAEnum(KnowledgeSourceType), nullable=False)
    source_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    file_name: Mapped[str | None] = mapped_column(String(500), nullable=True)
    file_size_bytes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    chunk_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[KnowledgeSourceStatus] = mapped_column(
        SAEnum(KnowledgeSourceStatus), default=KnowledgeSourceStatus.pending
    )
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    indexed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    employee: Mapped["Employee"] = relationship("Employee", back_populates="knowledge_sources")

    def __repr__(self) -> str:
        return f"<KnowledgeSource {self.source_type}: {self.source_url or self.file_name}>"
