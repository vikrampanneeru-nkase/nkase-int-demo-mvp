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
    tenat_progress: Optional[int]
    nkase_snapshot_id: Optional[str]
    nkase_snapshot_progress: Optional[int]
    nkase_volume_id: Optional[str]
    action: str
    status: str
    stage: str
    message: Optional[str]
    details: Optional[Any]
    timestamp: datetime
    case_number: Optional[str]
    account_id: Optional[str]
    errors: Optional[str]

    class Config:
        orm_mode = True


