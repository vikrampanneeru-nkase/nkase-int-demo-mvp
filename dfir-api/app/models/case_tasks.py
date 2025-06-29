from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, update
from app.db.database import Base, async_session_maker
from datetime import datetime

class CaseTask(Base):
    __tablename__ = "case_tasks"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String, nullable=False)  # Removed ForeignKey
    priority = Column(String, nullable=False)
    status = Column(String, nullable=False)
    assigned_to = Column(String, nullable=True)
    due_date = Column(TIMESTAMP, nullable=True)
    notes = Column(Text, nullable=True)
    completed_at = Column(TIMESTAMP, nullable=True)
    completed_by = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False)
    updated_at = Column(TIMESTAMP, nullable=True)
    job_id = Column(String, nullable=True)
    action = Column(String, nullable=True)
    description = Column(Text, nullable=True)

async def update_case_task_status(case_id, job_id, notes=None, status=None, error=None):
    """Update notes, status, error, and updated_at for a case task."""
    async with async_session_maker() as session:
        stmt = update(CaseTask).where(CaseTask.case_id == case_id)
        update_data = {"updated_at": datetime.utcnow()}
        if notes:
            update_data["notes"] = notes
        if status:
            update_data["status"] = status
        if error:
            # Append error to notes if notes exist, else set as notes
            if notes:
                update_data["notes"] = f"{notes}\nERROR: {error}"
            else:
                update_data["notes"] = f"ERROR: {error}"
        stmt = stmt.values(**update_data)
        await session.execute(stmt)
        await session.commit()


