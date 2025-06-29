from app.models.case_tasks import CaseTask
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert, update
from sqlalchemy.future import select
import json
from datetime import datetime
from sqlalchemy import cast
from sqlalchemy.dialects.postgresql import UUID
async def save_job_to_db(session: AsyncSession, job_id, instance_id, stage, data):
    details = json.loads(json.dumps(data))

    # Instead of updating MitigationJob, update CaseTask with job_id
    case_task = await session.execute(select(CaseTask).where(CaseTask.job_id == str(job_id)))
    task = case_task.scalars().first()
    if task:
        task.status = stage
        task.notes = str(data)
        task.updated_at = datetime.utcnow()
        # Set case_number if available in data or from task.case_id
        if hasattr(task, 'case_number'):
            task.case_number = data.get('case_number') if data and data.get('case_number') else getattr(task, 'case_id', None)
        await session.commit()
    # Optionally, handle the case where no CaseTask is found for this job_id

