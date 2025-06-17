from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from app.db.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, ForeignKey("cases.case_number"), nullable=False)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=True)
    action = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    performed_by = Column(String, nullable=True)
    timestamp = Column(TIMESTAMP, nullable=False)

