from pydantic import BaseModel
from uuid import UUID
from typing import Optional, Dict, Any
from datetime import datetime

class MitigationJobOut(BaseModel):
    job_id: UUID
    instance_id: str
    stage: str
    details: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

