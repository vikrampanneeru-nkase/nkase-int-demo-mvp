from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class TimelineEventBase(BaseModel):
    case_number: str
    timestamp: datetime
    epoch_time: int
    event_type: str
    title: str
    description: Optional[str] = None
    evidence_id: Optional[int] = None
    created_by: Optional[str] = None
   event_metadata: Optional[Dict] = None

class TimelineEventCreate(TimelineEventBase):
    pass

class TimelineEventOut(TimelineEventBase):
    id: int

    class Config:
        orm_mode = True

