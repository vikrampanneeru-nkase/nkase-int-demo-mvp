import asyncio
import aioboto3
import sys
import string
nkase_role_arn = "arn:aws:iam::483746227110:role/CrossAcctSnapshotCreator"
region = "us-east-1"
#AVAILABLE_DEVICE_NAMES = [f"/dev/sd{chr(c)}" for c in range(ord('f'), ord('p')+1)]
AVAILABLE_DEVICE_NAMES = [f"/dev/sd{chr(c)}" for c in range(ord('f'), ord('z')+1)]
async def get_nkase_session():
    base_session = aioboto3.Session()
    async with base_session.client("sts") as sts:
        response = await sts.assume_role(
            RoleArn=nkase_role_arn,
            RoleSessionName="NkaseSession"
        )
        credentials = response["Credentials"]
    return aioboto3.Session(
        aws_access_key_id=credentials["AccessKeyId"],
        aws_secret_access_key=credentials["SecretAccessKey"],
        aws_session_token=credentials["SessionToken"],
    )

async def nkase_process_snapshot(copiedsnapshot, instance_id, job_id, redis=None, case_number=None, account_id=None):
    from app.helpers.status_updater import set_status
    try:
        await set_status(
            redis=redis,
            job_id=job_id,
            account_id=account_id,
            case_number=case_number,
            stage="nkase snapshot processing started",
            status="processing",
            instance_id=instance_id,
            volume_id=None,
            snapshot_id=copiedsnapshot,
            tenat_progress=None,
            nkase_snapshot_id=copiedsnapshot,
            nkase_snapshot_progress=None,
            nkase_volume_id=None,
            message=None,
            errors=None,
            details={"note": f"Started nkase_process_snapshot for snapshot {copiedsnapshot}"}
        )
        session = await get_nkase_session()
        async with session.client("ec2", region_name=region) as nakse_ec2:
            print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Waiting for copied snapshot {copiedsnapshot} to complete...\033[0m", file=sys.stderr)
            # Wait for the copied snapshot to complete
            while True:
                snap_status = await nakse_ec2.describe_snapshots(SnapshotIds=[copiedsnapshot])
                snap_state = snap_status["Snapshots"][0]["State"]
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
                    stage="nkase snapshot state check",
                    status=snap_state,
                    instance_id=instance_id,
                    volume_id=None,
                    snapshot_id=copiedsnapshot,
                    tenat_progress=None,
                    nkase_snapshot_id=copiedsnapshot,
                    nkase_snapshot_progress=percent,
                    nkase_volume_id=None,
                    message=None,
                    errors=None,
                    details={"note": f"Copied snapshot {copiedsnapshot} state: {snap_state}"}
                )
                if snap_state == 'completed':
                    break
                elif snap_state == 'error':
                    await set_status(
                        redis=redis,
                        job_id=job_id,
                        account_id=account_id,
                        case_number=case_number,
                        stage="nkase snapshot failed",
                        status="error",
                        instance_id=instance_id,
                        volume_id=None,
                        snapshot_id=copiedsnapshot,
                        tenat_progress=None,
                        nkase_snapshot_id=copiedsnapshot,
                        nkase_snapshot_progress=percent,
                        nkase_volume_id=None,
                        message="Copied snapshot failed",
                        errors=f"Copied snapshot {copiedsnapshot} failed!",
                        details={"note": f"Copied snapshot {copiedsnapshot} failed!"}
                    )
                    return False
                await asyncio.sleep(10)
            await set_status(
                redis=redis,
                job_id=job_id,
                account_id=account_id,
                case_number=case_number,
                stage="nkase create volume from snapshot",
                status="creating volume",
                instance_id=instance_id,
                volume_id=None,
                snapshot_id=copiedsnapshot,
                tenat_progress=None,
                nkase_snapshot_id=copiedsnapshot,
                nkase_snapshot_progress=None,
                nkase_volume_id=None,
                message=None,
                errors=None,
                details={"note": f"Creating volume from snapshot {copiedsnapshot}"}
            )
            print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Creating volume from snapshot {copiedsnapshot}...\033[0m", file=sys.stderr)
            # Create a volume from the copied snapshot
            vol_response = await nakse_ec2.create_volume(
                AvailabilityZone=f"{region}a",  # You may want to make this dynamic
                SnapshotId=copiedsnapshot,
                VolumeType="gp2"
            )
            volume_id = vol_response["VolumeId"]
            await set_status(
                redis=redis,
                job_id=job_id,
                account_id=account_id,
                case_number=case_number,
                stage="nkase volume created",
                status="volume created",
                instance_id=instance_id,
                volume_id=volume_id,
                snapshot_id=copiedsnapshot,
                tenat_progress=None,
                nkase_snapshot_id=copiedsnapshot,
                nkase_snapshot_progress=None,
                nkase_volume_id=volume_id,
                message=None,
                errors=None,
                details={"note": f"Created volume {volume_id} from snapshot {copiedsnapshot}"}
            )
            print(f"\033[92m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Created volume {volume_id} from snapshot {copiedsnapshot}\033[0m", file=sys.stderr)
            # Optionally, you can attach the volume to an instance here
            attach_response = await attach_volume_to_instance(nakse_ec2, volume_id, instance_id, case_number, job_id, copiedsnapshot, redis=redis)
            await set_status(
                redis=redis,
                job_id=job_id,
                account_id=account_id,
                case_number=case_number,
                stage="nkase volume attached",
                status="attached",
                instance_id=instance_id,
                volume_id=volume_id,
                snapshot_id=copiedsnapshot,
                tenat_progress=None,
                nkase_snapshot_id=copiedsnapshot,
                nkase_snapshot_progress=None,
                nkase_volume_id=volume_id,
                message=None,
                errors=None,
                details={"note": f"Attach response: {attach_response}"}
            )
            print(f"\033[92m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Attach response: {attach_response}\033[0m", file=sys.stderr)
            return volume_id
    except Exception as e:
        print(f"\033[91m[ERROR][Case {case_number}][Instance {instance_id}][Job {job_id}] Exception in nkase_process_snapshot: {e}\033[0m", file=sys.stderr)
        if redis is not None and job_id is not None:
            await redis.set(f"nkase_process_snapshot_error:{job_id}", str(e))
            await set_status(
                redis=redis,
                job_id=job_id,
                account_id=account_id,
                case_number=case_number,
                stage="nkase process snapshot error",
                status="error",
                instance_id=instance_id,
                volume_id=None,
                snapshot_id=copiedsnapshot,
                tenat_progress=None,
                nkase_snapshot_id=copiedsnapshot,
                nkase_snapshot_progress=None,
                nkase_volume_id=None,
                message="Exception in nkase_process_snapshot",
                errors=str(e),
                details={"note": f"Exception in nkase_process_snapshot: {e}"}
            )
        return False

async def attach_volume_to_instance(ec2_client, volume_id, instance_id, case_number=None, job_id=None, snapshot_id=None, redis=None):
    import botocore
    try:
        print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Waiting for volume {volume_id} (from snapshot {snapshot_id}) to be 'available' before attaching...\033[0m", file=sys.stderr)
        # Wait for volume to be in 'available' state before attaching
        await wait_until_volume_available(ec2_client, volume_id, case_number=case_number, job_id=job_id, instance_id=instance_id, snapshot_id=snapshot_id, redis=redis)
        print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Volume {volume_id} is available, proceeding to attach...\033[0m", file=sys.stderr)
        device_name = await get_available_device_name(ec2_client, instance_id)
        max_retries = 6
        backoff = 2
        for attempt in range(1, max_retries + 1):
            try:
                print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Attempt {attempt}: Attaching volume {volume_id} (from snapshot {snapshot_id}) to instance {instance_id} as {device_name}...\033[0m", file=sys.stderr)
                attach_resp = await ec2_client.attach_volume(
                    Device=device_name,
                    InstanceId=instance_id,
                    VolumeId=volume_id
                )
                # Wait for attachment state to become 'attached'
                max_wait = 60  # seconds
                poll_interval = 5
                waited = 0
                while waited < max_wait:
                    vol_info = await ec2_client.describe_volumes(VolumeIds=[volume_id])
                    attachments = vol_info['Volumes'][0].get('Attachments', [])
                    if attachments and attachments[0].get('State') == 'attached':
                        print(f"\033[92m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Volume {volume_id} (from snapshot {snapshot_id}) attached to instance {instance_id} as {device_name}\033[0m", file=sys.stderr)
                        # Return detailed attachment info
                        attachment = attachments[0]
                        return {
                            'device_name': device_name,
                            'instance_id': instance_id,
                            'volume_id': volume_id,
                            'attachment_state': attachment.get('State'),
                            'attach_time': str(attachment.get('AttachTime')),
                            'delete_on_termination': attachment.get('DeleteOnTermination'),
                            'attachment': attachment
                        }
                    await asyncio.sleep(poll_interval)
                    waited += poll_interval
                print(f"\033[91m[ERROR][Case {case_number}][Instance {instance_id}][Job {job_id}] Timed out waiting for volume {volume_id} (from snapshot {snapshot_id}) to attach.\033[0m", file=sys.stderr)
                return None
            except botocore.exceptions.ClientError as e:
                error_code = e.response['Error']['Code']
                if error_code == 'IncorrectState':
                    print(f"\033[93m[WARN][Case {case_number}][Instance {instance_id}][Job {job_id}] Attach attempt {attempt} failed with IncorrectState. Retrying in {backoff} seconds...\033[0m", file=sys.stderr)
                    await asyncio.sleep(backoff)
                    backoff *= 2
                    continue
                else:
                    print(f"\033[91m[ERROR][Case {case_number}][Instance {instance_id}][Job {job_id}] Attach failed with unexpected error: {e}\033[0m", file=sys.stderr)
                    raise
        print(f"\033[91m[ERROR][Case {case_number}][Instance {instance_id}][Job {job_id}] Failed to attach volume {volume_id} (from snapshot {snapshot_id}) to instance {instance_id} after {max_retries} attempts.\033[0m", file=sys.stderr)
        return None
    except Exception as e:
        print(f"\033[91m[ERROR][Case {case_number}][Instance {instance_id}][Job {job_id}] Exception in attach_volume_to_instance: {e}\033[0m", file=sys.stderr)
        if redis is not None and job_id is not None:
            await redis.set(f"attach_volume_to_instance_error:{job_id}", str(e))
        return None

async def wait_until_volume_available(ec2_client, volume_id, max_attempts=12, delay=5, case_number=None, job_id=None, instance_id=None, snapshot_id=None, redis=None):
    import sys
    try:
        for attempt in range(max_attempts):
            vol_info = await ec2_client.describe_volumes(VolumeIds=[volume_id])
            state = vol_info['Volumes'][0]['State']
            print(f"\033[94m[DEBUG][Case {case_number}][Instance {instance_id}][Job {job_id}] Attempt {attempt+1}: Volume {volume_id} (from snapshot {snapshot_id}) state: {state}\033[0m", file=sys.stderr)
            if state == 'available':
                return
            await asyncio.sleep(delay)
        raise TimeoutError(f"[Case {case_number}][Instance {instance_id}][Job {job_id}] Volume {volume_id} (from snapshot {snapshot_id}) did not reach 'available' state after {max_attempts * delay} seconds.")
    except Exception as e:
        print(f"\033[91m[ERROR][Case {case_number}][Instance {instance_id}][Job {job_id}] Exception in wait_until_volume_available: {e}\033[0m", file=sys.stderr)
        if redis is not None and job_id is not None:
            await redis.set(f"wait_until_volume_available_error:{job_id}", str(e))
        raise

def get_device_name(volumes):

    print("volumes are -->",volumes['BlockDeviceMappings'])
    existDeviceNameList=[]
    for item in volumes:
        existDeviceNameList.append(item['DeviceName'])
    print('device lists are :',existDeviceNameList)
    appendDevice='/dev/sd'
    getDeviceLastCol=chr(102+len(existDeviceNameList))
    attachDevice=appendDevice+getDeviceLastCol
    print('AttachDevice',attachDevice)
    return attachDevice
async def get_available_device_name(ec2_client, instance_id):
    attached_devices = await get_attached_devices(ec2_client, instance_id)
    normalized_attached = [normalize_device_name(dev) for dev in attached_devices]

    print(f"\033[94m[DEBUG] Normalized attached devices: {normalized_attached}\033[0m")

    for device in AVAILABLE_DEVICE_NAMES:
        if device not in normalized_attached:
            print(f"\033[92m[DEBUG] Found available device: {device}\033[0m")
            return device

    print(f"\033[91m[ERROR] No available device names found for {instance_id}\033[0m")
    return None
def normalize_device_name(device_name: str) -> str:
    # Convert /dev/xvdX to /dev/sdX
    if device_name.startswith("/dev/xvd"):
        return "/dev/sd" + device_name[8:]
    return device_name
async def get_attached_devices(ec2_client, instance_id):
    response = await ec2_client.describe_instances(InstanceIds=[instance_id])
    devices = response["Reservations"][0]["Instances"][0].get("BlockDeviceMappings", [])
    return [device["DeviceName"] for device in devices]

