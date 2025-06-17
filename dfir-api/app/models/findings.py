from sqlalchemy import Column, Integer, String, Text, JSON, TIMESTAMP, ForeignKey
from app.db.database import Base

class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, ForeignKey("cases.case_number"), nullable=False)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=True)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, default='medium', nullable=False)
    found_at = Column(TIMESTAMP, nullable=False)
    found_by = Column(String, nullable=True)
    event_metadata = Column(JSON, nullable=True)

