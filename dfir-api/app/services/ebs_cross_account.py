# ...file intentionally left blank, logic restored to ebs_ops.py...
import aioboto3
import asyncio
import sys
from app.helpers.status_updater import set_status

tenat_role_arn = "arn:aws:iam::339751003344:role/CrossAccEBSVolSnapCreation" 
print(f"tenat_role_arn: {tenat_role_arn}")
print(f"aioboto3: {aioboto3}")
print(f"asyncio: {asyncio}")

async def get_cross_account_session(tenant_role_arn: str):
    base_session = aioboto3.Session()

    async with base_session.client("sts") as sts:
        response = await sts.assume_role(
            RoleArn=tenant_role_arn,
            RoleSessionName="DFIRSession"
        )
        credentials = response["Credentials"]

    assumed_session = aioboto3.Session(
        aws_access_key_id=credentials["AccessKeyId"],
        aws_secret_access_key=credentials["SecretAccessKey"],
        aws_session_token=credentials["SessionToken"],
    )

    return assumed_session
async def create_snapshots(instance_id: str, job_id: str, redis=None, case_number=None, account_id=None):
    try:
        print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Starting create_snapshots for instance_id={instance_id}, job_id={job_id}, account_id={account_id}\033[0m", file=sys.stderr)
        await set_status(
            redis=redis,
            job_id=job_id,
            account_id=account_id,
            case_number=case_number,
            stage="snapshot job initiated",
            status="Snapshot creation initiated",
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
                "note": f"Snapshot creation started for instance id: {instance_id} with job id: {job_id}"
            }
        )
        session = await get_cross_account_session(tenat_role_arn)
        print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Got cross-account session for tenant role\033[0m", file=sys.stderr)
        async with session.client("ec2", region_name="us-east-1") as ec2:
            print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Created EC2 client for region us-east-1\033[0m", file=sys.stderr)
            reservations = await ec2.describe_instances(InstanceIds=[instance_id])
            print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Got reservations: {reservations}\033[0m", file=sys.stderr)
            instance = reservations["Reservations"][0]["Instances"][0]
            volume_ids = [bdm["Ebs"]["VolumeId"] for bdm in instance["BlockDeviceMappings"]]
            print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Found volume_ids: {volume_ids}\033[0m", file=sys.stderr)
            await set_status(
                redis=redis,
                job_id=job_id,
                account_id=account_id,
                case_number=case_number,
                stage="snapshot creation started",
                status="Snapshot creation started",
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
                    "note": f"Fetching list of volumes from instance id: {instance_id} with job id: {job_id}"
                }
            )
            snapshot_map = {}
            for vol_id in volume_ids:
                try:
                    print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Starting snapshot for volume {vol_id}\033[0m", file=sys.stderr)
                    await set_status(
                    redis=redis,
                    job_id=job_id,
                    account_id=account_id,
                    case_number=case_number,
                    stage="Identifying volumes",
                    status="Identifying volumes",
                    instance_id=instance_id,
                    volume_id=vol_id,
                    snapshot_id=None,
                    tenat_progress=None,
                    nkase_snapshot_id=None,
                    nkase_snapshot_progress=None,
                    nkase_volume_id=None,
                    message=None,
                    errors=None,
                    details={
                        "note": f"Fetching list of volumes from instance id: {instance_id} with job id: {job_id}"
                    }
                ) 
                    if redis and job_id:
                        await redis.set(f"snapshot_status:{job_id}:{vol_id}", f"starting snapshot for {vol_id}")
                        await asyncio.sleep(15)
                    response = await ec2.create_snapshot(
                        VolumeId=vol_id,
                        Description=f"Snapshot of {instance_id} volume {vol_id}",
                        TagSpecifications=[{
                            "ResourceType": "snapshot",
                            "Tags": [
                                {"Key": "InstanceId", "Value": instance_id},
                                {"Key": "JobId", "Value": job_id}
                            ],
                        }],
                    )
                    snapshot_id = response["SnapshotId"]
                    print(f"\033[92m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Snapshot started: snapshot_id={snapshot_id} for volume {vol_id}\033[0m", file=sys.stderr)
                    print(f"\033[92m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] create_snapshot response for {vol_id}: {response}\033[0m", file=sys.stderr)
                    snapshot_map[vol_id] = snapshot_id
                    if redis and job_id:
                        await redis.set(f"snapshot_status:{job_id}:{vol_id}", f"created snapshot {snapshot_id}")
                except Exception as e:
                    print(f"\033[91m[ERROR][Case {case_number}][Instance {instance_id}][Job {job_id}] Error creating snapshot for volume {vol_id}: {e}\033[0m", file=sys.stderr)
                    if redis and job_id:
                        await redis.set(f"snapshot_status:{job_id}:{vol_id}", f"error: {str(e)}")
            print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Returning snapshot_map: {snapshot_map}\033[0m", file=sys.stderr)
            return snapshot_map
    except Exception as e:
        print(f"\033[91m[ERROR][Case {case_number}][Instance {instance_id}][Job {job_id}] Exception in create_snapshots: {e}\033[0m", file=sys.stderr)
        if redis is not None and job_id is not None:
            await redis.set(f"create_snapshots_error:{job_id}", str(e))
        return None

async def process_snapshot(volume_id, snapshot_id, instance_id, job_id, redis=None, case_number=None, account_id=None):
    try:
        session = await get_cross_account_session(tenat_role_arn)
        async with session.client("ec2", region_name="us-east-1") as ec2:
            print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Processing snapshot {snapshot_id} for volume {volume_id}\033[0m", file=sys.stderr)
            # DO NOT create_snapshot again!
            # Wait for snapshot to complete
            while True:
                snap_status = await ec2.describe_snapshots(SnapshotIds=[snapshot_id])
                snap_state = snap_status["Snapshots"][0]["State"]
                print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Snapshot {snapshot_id} (volume {volume_id}) state: {snap_state}\033[0m", file=sys.stderr)
                # Print percent complete if available
                percent = snap_status["Snapshots"][0].get("Progress")
                if percent is not None and isinstance(percent, str) and percent.endswith('%'):
                    percent = int(percent.replace('%', ''))
                else:
                    try:
                        percent = int(percent)
                    except (ValueError, TypeError):
                        percent = None
                await set_status(
                    redis=redis,
                    job_id=job_id,
                    account_id=account_id,
                    case_number=case_number,
                    stage="snapshot creation status",
                    status="snapshot_processing",
                    instance_id=instance_id,
                    volume_id=volume_id,
                    snapshot_id=snapshot_id,
                    tenat_progress=percent,
                    nkase_snapshot_id=None,
                    nkase_snapshot_progress=None,
                    nkase_volume_id=None,
                    message=None,
                    errors=None,
                    details={
                        "note": f"Processing snapshot {snapshot_id} for volume {volume_id} for instance {instance_id}"
                    }
                )
                if percent is not None:
                    print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Snapshot {snapshot_id} (volume {volume_id}) progress: {percent}\033[0m", file=sys.stderr)
                if snap_state == 'completed':
                    # Grant createVolumePermission to the snapshot for cross-account use
                    await set_status(
                        redis=redis,
                        job_id=job_id,
                        account_id=account_id,
                        case_number=case_number,
                        stage="snapshot creation status",
                        status="Snapshot completed",
                        instance_id=instance_id,
                        volume_id=volume_id,
                        snapshot_id=snapshot_id,
                        tenat_progress=percent,
                        nkase_snapshot_id=None,
                        nkase_snapshot_progress=None,
                        nkase_volume_id=None,
                        message=None,
                        errors=None,
                        details={
                            "note": f"Snapshot Processing Completed {snapshot_id} for volume {volume_id} for instance {instance_id}"
                        }
                    )
                    await ec2.modify_snapshot_attribute(
                        Attribute='createVolumePermission',
                        OperationType='add',
                        SnapshotId=snapshot_id,
                        UserIds=['483746227110']
                    )
                    await set_status(
                        redis=redis,
                        job_id=job_id,
                        account_id=account_id,
                        case_number=case_number,
                        stage="snapshot creation status",
                        status="Permission granted",
                        instance_id=instance_id,
                        volume_id=volume_id,
                        snapshot_id=snapshot_id,
                        tenat_progress=percent,
                        nkase_snapshot_id=None,
                        nkase_snapshot_progress=None,
                        nkase_volume_id=None,
                        message=None,
                        errors=None,
                        details={
                            "note": f"Permission granted for snapshot {snapshot_id} for volume {volume_id} for instance {instance_id} to account 483746227110"
                        }
                    )
                    print(f"\033[92m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Permission granted for snapshot {snapshot_id} (volume {volume_id}) to account 483746227110\033[0m", file=sys.stderr)
                    return snapshot_id  # Return the snapshot id to mitigation_worker
                elif snap_state == 'error':
                    print(f"\033[91m[ERROR][Case {case_number}][Instance {instance_id}][Job {job_id}] Snapshot {snapshot_id} (volume {volume_id}) failed!\033[0m", file=sys.stderr)
                    if redis is not None and job_id is not None:
                        await redis.set(f"process_snapshot_error:{job_id}", f"Snapshot {snapshot_id} (volume {volume_id}) failed!")
                        await set_status(
                            redis=redis,
                            job_id=job_id,
                            account_id=account_id,
                            case_number=case_number,
                            stage="snapshot creation status",
                            status="Snapshot failed",
                            instance_id=instance_id,
                            volume_id=volume_id,
                            snapshot_id=snapshot_id,
                            tenat_progress=None,
                            nkase_snapshot_id=None,
                            nkase_snapshot_progress=None,
                            nkase_volume_id=None,
                            message="Snapshot creation failed",
                            errors=f"Snapshot {snapshot_id} (volume {volume_id}) failed!",
                            details={
                                "note": f"Snapshot processing failed for {snapshot_id} for volume {volume_id} for instance {instance_id}"
                            }
                        )
                    return False
                await asyncio.sleep(10)  # Poll every 10 seconds
        return True
    except Exception as e:
        print(f"\033[91m[ERROR][Case {case_number}][Instance {instance_id}][Job {job_id}] Exception in process_snapshot: {e}\033[0m", file=sys.stderr)
        if redis is not None and job_id is not None:
            await redis.set(f"process_snapshot_error:{job_id}", str(e))
            await set_status(
                redis=redis,
                job_id=job_id,
                account_id=account_id,
                case_number=case_number,
                stage="snapshot creation status",
                status="Snapshot processing failed",
                instance_id=instance_id,
                volume_id=volume_id,
                snapshot_id=snapshot_id,
                tenat_progress=None,
                nkase_snapshot_id=None,
                nkase_snapshot_progress=None,
                nkase_volume_id=None,
                message="Snapshot processing failed",
                errors=str(e),
                details={
                    "note": f"Snapshot processing failed for {snapshot_id} for volume {volume_id} for instance {instance_id}"
                }
            )
        return False
