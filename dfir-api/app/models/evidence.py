from sqlalchemy import Column, Integer, String, Text, JSON, TIMESTAMP, Boolean, ForeignKey
from app.db.database import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, ForeignKey("cases.case_number"), nullable=False)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    path = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    hash = Column(String, nullable=True)
    sha1_hash = Column(String, nullable=True)
    md5_hash = Column(String, nullable=True)
    metadata = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
    added_at = Column(TIMESTAMP, nullable=False)
    added_by = Column(String, nullable=True)
    chain_of_custody = Column(Boolean, default=False)
    legal_hold = Column(Boolean, default=False)

