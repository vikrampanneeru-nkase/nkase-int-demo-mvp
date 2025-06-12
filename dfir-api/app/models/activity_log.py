
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class  ActivityLog(Base):
    __tablename__ = "activity_log"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    account_id: Mapped[str] = mapped_column(String, nullable=False)
    instance_id: Mapped[str] = mapped_column(String, nullable=False)
    vpc_id: Mapped[str] = mapped_column(String, nullable=True)
    action: Mapped[str] = mapped_column(String, nullable=False)  # e.g. "quarantine" or "unquarantine"
    status: Mapped[str] = mapped_column(String, nullable=False)  # "success" or "failure"
    message: Mapped[str] = mapped_column(String, nullable=True)  # error message if failure
    performed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


