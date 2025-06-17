# app/schemas/action_job_detail.py
from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime
from uuid import UUID

class ActionJobDetailResponse(BaseModel):
    id: int
    job_id: UUID
    instance_id: str
    volume_id: Optional[str]
    snapshot_id: Optional[str]
    action: str
    status: str
    progress: Optional[int]
    message: Optional[str]
    details: Optional[Any]
    timestamp: datetime

    class Config:
        orm_mode = True

