from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID

class ActivityLogResponse(BaseModel):
    id: UUID
    account_id: str
    instance_id: str
    vpc_id: Optional[str]
    action: str
    status: str
    message: Optional[str]
    performed_at: datetime

    class Config:
        orm_mode = True
    
