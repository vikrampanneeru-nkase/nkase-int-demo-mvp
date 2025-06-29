from sqlalchemy import Column, String, Text, Enum, TIMESTAMP
import enum
from app.db.database import Base
from sqlalchemy.schema import FetchedValue

class PriorityEnum(str, enum.Enum):
    Low = 'Low'
    Medium = 'Medium'
    High = 'High'

class StatusEnum(str, enum.Enum):
    Open = 'Open'
    InProgress = 'In Progress'
    Closed = 'Closed'

class Case(Base):
    __tablename__ = "cases"

    case_number = Column(String, primary_key=True, index=True,server_default=FetchedValue())  # e.g., SEC00001
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(Enum(PriorityEnum), nullable=False, default=PriorityEnum.Medium)
    status = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.Open)
    assigned_to = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=True)
    due_date = Column(TIMESTAMP, nullable=True)

