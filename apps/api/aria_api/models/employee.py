import uuid
import enum
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Text, JSON, Boolean, func, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from aria_api.db.base import Base


class EmployeeRoleType(str, enum.Enum):
    customer_support = "customer_support"
    sdr = "sdr"
    ops_coordinator = "ops_coordinator"


class EmployeeStatus(str, enum.Enum):
    active = "active"
    paused = "paused"
    training = "training"
    draft = "draft"


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    tenant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role_type: Mapped[EmployeeRoleType] = mapped_column(SAEnum(EmployeeRoleType), nullable=False)
    persona_prompt: Mapped[str | None] = mapped_column(Text, nullable=True)
    llm_model: Mapped[str] = mapped_column(String(100), default="gpt-4o-mini")
    llm_model_reasoning: Mapped[str] = mapped_column(String(100), default="gpt-4o")
    tools_config: Mapped[dict] = mapped_column(JSON, default=dict)
    guardrails_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    hitl_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[EmployeeStatus] = mapped_column(SAEnum(EmployeeStatus), default=EmployeeStatus.draft)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    tenant: Mapped["Tenant"] = relationship("Tenant", back_populates="employees")
    channels: Mapped[list["ChannelConfig"]] = relationship("ChannelConfig", back_populates="employee")
    knowledge_sources: Mapped[list["KnowledgeSource"]] = relationship("KnowledgeSource", back_populates="employee")
    conversations: Mapped[list["Conversation"]] = relationship("Conversation", back_populates="employee")

    @property
    def chroma_collection_name(self) -> str:
        return f"tenant_{str(self.tenant_id).replace('-', '')}_emp_{str(self.id).replace('-', '')}_kb"

    @property
    def memory_db_path(self) -> str:
        return f"data/tenants/{self.tenant_id}/mem_{self.id}.db"

    def __repr__(self) -> str:
        return f"<Employee {self.name} ({self.role_type})>"
