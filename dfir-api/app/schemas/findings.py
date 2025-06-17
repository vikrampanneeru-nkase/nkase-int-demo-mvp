from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class FindingBase(BaseModel):
    case_number: str
    evidence_id: Optional[int] = None
    title: str
    description: str
    severity: Optional[str] = 'medium'
    event_metadata: Optional[Dict] = None
    found_by: Optional[str] = None

class FindingCreate(FindingBase):
    pass

class FindingOut(FindingBase):
    id: int
    found_at: datetime

    class Config:
        orm_mode = True

