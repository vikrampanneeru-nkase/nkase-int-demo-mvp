# app/models/action_job_detail.py
from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime
from app.db.database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid

class ActionJobDetail(Base):
    __tablename__ = "action_job_details"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(UUID(as_uuid=True), nullable=False)  # Removed ForeignKey constraint
    instance_id = Column(String, nullable=False)
    snapshot_id = Column(String, nullable=True)
    tenat_progress = Column(Integer, nullable=True)  # For tenant-specific progress
    volume_id = Column(String, nullable=True)
    nkase_snapshot_id = Column(String, nullable=True) 
    nkase_snapshot_progress = Column(Integer, nullable=True)   # For NKase snapshots
    nkase_volume_id = Column(String, nullable=True)  # For NKase volumes
    action = Column(String, nullable=False)      # e.g., snapshot_create, volume_found
    status = Column(String, nullable=False)
    stage = Column(String, nullable=False)      # in_progress, completed, failed
      # 0-100 for snapshots
    message = Column(String, nullable=True)      # error/info message
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    case_number = Column(String, nullable=True)
    account_id = Column(String, nullable=True)
    # Alias for progress, for clarity
    errors = Column(String, nullable=True)



