from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ForensicHashBase(BaseModel):
    case_number: str
    evidence_id: int
    sha256_hash: str
    sha1_hash: Optional[str] = None
    md5_hash: Optional[str] = None
    verified_by: str
    verification_method: str
    verification_status: Optional[str] = 'verified'
    blockchain_id: Optional[str] = None
    blockchain_timestamp: Optional[datetime] = None
    legal_certification: Optional[bool] = False
    certificate_id: Optional[str] = None

class ForensicHashCreate(ForensicHashBase):
    pass

class ForensicHashOut(ForensicHashBase):
    id: int
    verified_at: datetime

    class Config:
        orm_mode = True

