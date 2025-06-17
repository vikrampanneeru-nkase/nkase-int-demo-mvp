from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from app.db.database import Base

class CaseTask(Base):
    __tablename__ = "case_tasks"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, ForeignKey("cases.case_number"), nullable=False)
    template_id = Column(Integer, nullable=True)
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False)
    priority = Column(String, default='medium', nullable=False)
    status = Column(String, default='pending', nullable=False)
    assigned_to = Column(String, nullable=True)
    due_date = Column(TIMESTAMP, nullable=True)
    notes = Column(Text, nullable=True)
    sequence = Column(Integer, nullable=False)
    completed_at = Column(TIMESTAMP, nullable=True)
    completed_by = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=True)

