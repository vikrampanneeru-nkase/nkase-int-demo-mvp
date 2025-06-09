from sqlalchemy import Column, String, DateTime, JSON
from datetime import datetime
from app.db.database import Base
from sqlalchemy.dialects.postgresql import UUID
import uuid
class MitigationJob(Base):
    __tablename__ = "mitigation_jobs"

    job_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instance_id = Column(String, nullable=False)
    stage = Column(String, nullable=False)
    details = Column(JSON, nullable=True)  # <-- Add this column
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

