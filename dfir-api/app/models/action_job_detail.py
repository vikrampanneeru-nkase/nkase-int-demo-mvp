# app/models/action_job_detail.py
from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from datetime import datetime
from app.db.database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class ActionJobDetail(Base):
    __tablename__ = "action_job_details"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("mitigation_jobs.job_id", ondelete="CASCADE"), nullable=False)
    instance_id = Column(String, nullable=False)
    volume_id = Column(String, nullable=True)
    snapshot_id = Column(String, nullable=True)
    action = Column(String, nullable=False)      # e.g., snapshot_create, volume_found
    status = Column(String, nullable=False)      # in_progress, completed, failed
    progress = Column(Integer, nullable=True)    # 0-100 for snapshots
    message = Column(String, nullable=True)      # error/info message
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

