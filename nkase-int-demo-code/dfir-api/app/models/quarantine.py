
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class QuarantinedInstance(Base):
    __tablename__ = "quarantined_instances"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    account_id: Mapped[str] = mapped_column(String)
    instance_id: Mapped[str] = mapped_column(String)
    vpc_id: Mapped[str] = mapped_column(String)
    nic_id: Mapped[str] = mapped_column(String)
    existing_security_group: Mapped[str] = mapped_column(String)
    quarantine_security_group: Mapped[str] = mapped_column(String)
    is_quarantined: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=func.now())

