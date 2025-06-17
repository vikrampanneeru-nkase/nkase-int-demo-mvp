from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivityBase(BaseModel):
    case_number: str
    evidence_id: Optional[int] = None
    action: str
    description: str
    performed_by: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityOut(ActivityBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

