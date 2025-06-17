from pydantic import BaseModel,Field
from typing import Optional
from datetime import datetime
import enum

class PriorityEnum(str, enum.Enum):
    Low = 'Low'
    Medium = 'Medium'
    High = 'High'

class StatusEnum(str, enum.Enum):
    Open = 'Open'
    InProgress = 'In Progress'
    Closed = 'Closed'

class CaseBase(BaseModel):
    title: str
    priority: PriorityEnum
    status: StatusEnum
    assigned_to: Optional[str] = Field(None, alias="accountName")

    class Config:
        allow_population_by_field_name = True
        orm_mode = True

class CaseCreate(CaseBase):
    pass

class CaseOut(CaseBase):
    case_number: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

