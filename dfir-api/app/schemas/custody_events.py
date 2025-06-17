from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class CustodyEventBase(BaseModel):
    case_number: str
    evidence_id: int
    event_type: str
    description: str
    performed_by: str
    timestamp: datetime
    location: str
    previous_custodian_id: Optional[str] = None
    new_custodian_id: Optional[str] = None
    hash_verified: Optional[bool] = False
    witness_name: Optional[str] = None
    witness_title: Optional[str] = None
    record_hash: Optional[str] = None
    metadata: Optional[Dict] = None

class CustodyEventCreate(CustodyEventBase):
    pass

class CustodyEventOut(CustodyEventBase):
    id: int

    class Config:
        orm_mode = True

