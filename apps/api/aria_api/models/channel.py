import uuid
import enum
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Text, Boolean, func, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from aria_api.db.base import Base


class ChannelType(str, enum.Enum):
    slack = "slack"
    whatsapp = "whatsapp"
    email = "email"
    telegram = "telegram"
    web = "web"


class ChannelStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    error = "error"


class ChannelConfig(Base):
    __tablename__ = "channel_configs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    employee_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True
    )
    channel_type: Mapped[ChannelType] = mapped_column(SAEnum(ChannelType), nullable=False)
    credentials_encrypted: Mapped[str | None] = mapped_column(Text, nullable=True)
    webhook_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[ChannelStatus] = mapped_column(SAEnum(ChannelStatus), default=ChannelStatus.inactive)
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    employee: Mapped["Employee"] = relationship("Employee", back_populates="channels")

    def __repr__(self) -> str:
        return f"<ChannelConfig {self.channel_type} ({self.status})>"
