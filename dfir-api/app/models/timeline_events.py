from sqlalchemy import Column, Integer, String, Text, JSON, TIMESTAMP, ForeignKey
from app.db.database import Base

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, ForeignKey("cases.case_number"), nullable=False)
    timestamp = Column(TIMESTAMP, nullable=False)
    epoch_time = Column(Integer, nullable=False)
    event_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=True)
    created_by = Column(String, nullable=True)
#    metadata = Column(JSON, nullable=True)
    event_metadata = Column(JSON, nullable=True)

