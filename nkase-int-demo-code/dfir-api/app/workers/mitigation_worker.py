from arq.connections import RedisSettings
from app.helpers.status_updater import set_status

async def mitigation_worker(ctx, instance_id: str, job_id: str):
    redis = ctx["redis"]

    from app.services.ec2_ops import create_snapshot  # local import to avoid circular import at top level

    await set_status(redis, job_id, "started", {"instance_id": instance_id})

    try:
        await create_snapshot(instance_id=instance_id, job_id=job_id, redis=redis)
        await set_status(redis, job_id, "completed", {"instance_id": instance_id})
    except Exception as e:
        await set_status(redis, job_id, "failed", {"instance_id": instance_id, "error": str(e)})
        raise

class WorkerSettings:
    functions = [mitigation_worker]
    redis_settings = RedisSettings(host="localhost", port=6379)

