from sqlalchemy import Column, String, Text, TIMESTAMP
from app.db.database import Base
from sqlalchemy.schema import FetchedValue

class Case(Base):
    __tablename__ = "cases"

    case_number = Column(String, primary_key=True, index=True,server_default=FetchedValue())  # e.g., SEC00001
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String, nullable=False)
    status = Column(String, nullable=False)
    assigned_to = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=True)
    due_date = Column(TIMESTAMP, nullable=True)
    # Add missing fields for DFIR/Cloud context
    instance_id = Column(String, nullable=True)
    accountId = Column("accountid", String, nullable=True)  # Use DB column name 'accountid'
    resource_type = Column(String, nullable=True)
    cloud = Column(String, nullable=True)
    isquarantine = Column(String(1), nullable=True, default='N')





