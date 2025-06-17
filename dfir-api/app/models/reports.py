from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from app.db.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, ForeignKey("cases.case_number"), nullable=False)
    title = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String, default='draft', nullable=False)
    created_by = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=True)

