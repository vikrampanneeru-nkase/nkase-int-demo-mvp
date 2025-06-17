from sqlalchemy import Column, Integer, String, Text, JSON, TIMESTAMP, Boolean, ForeignKey
from app.db.database import Base

class CustodyEvent(Base):
    __tablename__ = "custody_events"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=False)
    case_number = Column(String, ForeignKey("cases.case_number"), nullable=False)
    event_type = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    performed_by = Column(String, nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False)
    location = Column(String, nullable=False)
    previous_custodian_id = Column(String, nullable=True)
    new_custodian_id = Column(String, nullable=True)
    hash_verified = Column(Boolean, default=False)
    witness_name = Column(String, nullable=True)
    witness_title = Column(String, nullable=True)
    record_hash = Column(String, nullable=True)
    metadata = Column(JSON, nullable=True)

