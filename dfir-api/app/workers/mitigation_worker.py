from arq.connections import RedisSettings
import asyncio
import sys
# from app.helpers.status_updater import set_status
from app.helpers.status_updater import set_status

async def mitigation_worker(ctx, instance_id: str, account_id: str, case_number: str, job_id: str):
    redis = ctx["redis"]
    from app.services.ebs_cross_account import create_snapshots,process_snapshot 
    from app.services.nkase_cross_account import nkase_process_snapshot  # local import to avoid circular import at top level

    # Commented out set_status calls for now
    # await set_status(redis, job_id, account_id, case_number, "started", {"instance_id": instance_id})

    try:
        await set_status(
                redis=redis,
                job_id=job_id,
                account_id=account_id,
                case_number=case_number,
                stage="Snapshot creation started",
                status="Sanpshot creation initiated",
                instance_id=instance_id,
                volume_id=None,
                snapshot_id=None,
                tenat_progress=None,
                nkase_snapshot_id=None,
                nkase_snapshot_progress=None,
                nkase_volume_id=None,
                message=None,
                errors=None,
                details={
                    "note": f"Snpshot creation started for instance id: {instance_id } with job id: {job_id}"
                }
            )
        snapshot_map = await create_snapshots(instance_id=instance_id, job_id=job_id, redis=redis, case_number=case_number, account_id=account_id)
        if not snapshot_map:
            print(f"\033[93m[DEBUG] No snapshots created for instance {instance_id} with job id {job_id}\033[0m", file=sys.stderr)
            await set_status(
                redis=redis,
                job_id=job_id,
                account_id=account_id,
                case_number=case_number,
                stage="Snapshot creation completed",
                status="No snapshots created",
                instance_id=instance_id,
                volume_id=None,
                snapshot_id=None,
                tenat_progress=None,
                nkase_snapshot_id=None,
                nkase_snapshot_progress=None,
                nkase_volume_id=None,
                message="No snapshots created",
                errors=None,
                details={
                    "note": f"No snapshots created for instance {instance_id} with job id {job_id}"
                }
            )
            return
        else:
            print(f"\033[92m[DEBUG] Snapshots created for instance {instance_id} with job id {job_id}: {snapshot_map}\033[0m", file=sys.stderr)
            await set_status(
                redis=redis,
                job_id=job_id,
                account_id=account_id,
                case_number=case_number,
                stage="Snapshot creation completed",
                status="Snapshots created",
                instance_id=instance_id,
                volume_id=None,
                snapshot_id=None,
                tenat_progress=None,
                nkase_snapshot_id=None,
                nkase_snapshot_progress=None,
                nkase_volume_id=None,
                message="Snapshots created",
                errors=None,
                details={
                    "note": f"Snapshots created for instance {instance_id} with job id {job_id}"
                }
            )
        # For each volume_id and snapshot_id, call the next function sequentially (await for each)
            for volume_id, snapshot_id in snapshot_map.items():
                    print(f"\033[94m[DEBUG] Processing volume_id={volume_id}, snapshot_id={snapshot_id}\033[0m", file=sys.stderr)
                    # Await and capture the returned snapshot_id from process_snapshot
                    result_snapshot_id = await process_snapshot(volume_id, snapshot_id, instance_id, job_id, redis, case_number, account_id)
                    print(f"\033[92m[DEBUG] Resulting snapshot_id for volume {volume_id}: {result_snapshot_id}\033[0m", file=sys.stderr)
                    await set_status(
                        redis=redis,
                        job_id=job_id,
                        account_id=account_id,
                        case_number=case_number,
                        stage="Snapshot processing completed",
                        status="Snapshot processing completed",
                        instance_id=instance_id,
                        volume_id=volume_id,
                        snapshot_id=result_snapshot_id,
                        tenat_progress=None,
                        nkase_snapshot_id=None,
                        nkase_snapshot_progress=None,
                        nkase_volume_id=None,
                        message=None,
                        errors=None,
                        details={
                            "note": f"Snapshot processing completed for volume {volume_id} with snapshot {result_snapshot_id}"
                        }
                    )
                    print(f"\033[92m[DEBUG] Snapshot processing completed for volume {volume_id} with snapshot {result_snapshot_id}\033[0m", file=sys.stderr)
                    await nkase_process_snapshot(result_snapshot_id, 'i-0eb7ecdac5c4b8bcf', job_id, redis, case_number, account_id)
    except Exception as e:
        # await set_status(redis, job_id, account_id, case_number, "failed", {"instance_id": instance_id, "error": str(e)})
        raise

class WorkerSettings:
    functions = [mitigation_worker]
    redis_settings = RedisSettings(host="localhost", port=6379)

