from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class EvidenceBase(BaseModel):
    case_number: str
    name: str
    type: str
    path: str
    size: int
    hash: Optional[str] = None
    sha1_hash: Optional[str] = None
    md5_hash: Optional[str] = None
    metadata: Optional[Dict] = None
    notes: Optional[str] = None
    added_by: Optional[str] = None
    chain_of_custody: Optional[bool] = False
    legal_hold: Optional[bool] = False

class EvidenceCreate(EvidenceBase):
    pass

class EvidenceOut(EvidenceBase):
    id: int
    added_at: datetime

    class Config:
        orm_mode = True

