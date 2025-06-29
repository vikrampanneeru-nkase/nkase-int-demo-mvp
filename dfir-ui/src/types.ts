export interface EC2Instance {
  InstanceId: string;
  InstanceType: string;
  State: string;
  PublicIpAddress: string | null;
  PrivateIpAddress: string;
  AvailabilityZone: string;
  Tags?: { Key: string; Value: string }[];
  VolumeIds?: string[];
  SecurityGroups?: {
    GroupId: string;
    GroupName: string;
  }[];
  is_quarantined: boolean;
}

export interface S3Bucket {
  Name: string;
  Region: string;
  CreationDate: string;
}

export interface DynamoDBTable {
  TableName: string;
  ItemCount?: number;
  CreationDateTime?: string;
  Region?: string;
}

export interface User {
  user_id: string;
  api_key: string;
  account_id: string;
  external_id: string;
  api_gateway_url: string;
  account_name: string;
  email_id: string;
}

export interface ResourcesResponse {
  EC2: EC2Instance[];
  S3: S3Bucket[];
  DynamoDB: DynamoDBTable[];
  Users: User[];
}

