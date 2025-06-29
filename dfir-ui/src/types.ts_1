export interface EC2Instance {
  InstanceId: string;
  InstanceType: string;
  State: string;
  PrivateIpAddress: string;
  AvailabilityZone: string;
  Tags?: { Key: string; Value: string }[];
  is_quarantined: boolean;
}

export interface S3Bucket {
  Name: string;
  Region: string;
  CreationDate: string;
}

export interface User {
  user_id: string;
  account_name: string;
  account_id: string;
}

export interface ResourcesResponse {
  EC2: EC2Instance[];
  S3: S3Bucket[];
  DynamoDB: any[];
  Users: User[];
}

