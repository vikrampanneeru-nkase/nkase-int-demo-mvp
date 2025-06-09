from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, Text, DateTime
from datetime import datetime
from app.db.database import Base  # your declarative base

class MitigationLog(Base):
    __tablename__ = "mitigation_logs"

    job_id: Mapped[str] = mapped_column(String(36), primary_key=True)  # uuid string
    instance_id: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    message: Mapped[str] = mapped_column(Text, nullable=True)   # <-- Here, str in Mapped[], Text in column
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    details = Column(Text, nullable=True)

