from app.models.mitigation_job import MitigationJob
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import insert, update
from sqlalchemy.future import select
import json
from datetime import datetime
from sqlalchemy import cast
from sqlalchemy.dialects.postgresql import UUID
async def save_job_to_db(session: AsyncSession, job_id, instance_id, stage, data):
    details = json.loads(json.dumps(data))

    stmt = await session.execute(select(MitigationJob).where(MitigationJob.job_id == cast(job_id, UUID)))
    job = stmt.scalars().first()
    print("job details are ",job)

    if job:
        job.stage = stage
        job.updated_at = datetime.utcnow()
        job.details = details
    else:
        job = MitigationJob(
            job_id=job_id,
            instance_id=instance_id,
            stage=stage,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            details=details
        )
        session.add(job)

    await session.commit()
