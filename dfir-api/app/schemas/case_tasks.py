from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CaseTaskBase(BaseModel):
    case_id: str
    template_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    category: str
    priority: Optional[str] = 'medium'
    status: Optional[str] = 'pending'
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    notes: Optional[str] = None
    sequence: int
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None

class CaseTaskCreate(CaseTaskBase):
    pass

class CaseTaskOut(CaseTaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

