import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetcher } from "../api/fetcher";
import {
  Server, CircleCheck, CircleX, MapPin, HardDrive, Cpu,
  Database, FolderOpen
} from "lucide-react";

export default function Investigations() {
  const [filter, setFilter] = useState<"all" | "running" | "stopped">("all");

  const {
    data: ec2Data,
    isLoading: ec2Loading,
    error: ec2Error,
  } = useQuery({
    queryKey: ["investigations"],
    queryFn: () => fetcher("investigations"),
  });

  const {
    data: s3Data,
    isLoading: s3Loading,
    error: s3Error,
  } = useQuery({
    queryKey: ["s3"],
    queryFn: () => fetcher("investigations/s3"),
  });

  const {
    data: dynamoData,
    isLoading: dynamoLoading,
    error: dynamoError,
  } = useQuery({
    queryKey: ["dynamodb"],
    queryFn: () => fetcher("investigations/dynamodb"),
  });

  const filteredEC2 = Array.isArray(ec2Data)
    ? ec2Data.filter((instance: any) =>
        filter === "all" ? true : instance.State === filter
      )
    : [];

  return (
    <div className="p-6 space-y-10">
      {/* ======================== EC2 ======================== */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">EC2</h2>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-6">
          {["all", "running", "stopped"].map((state) => (
            <button
              key={state}
              onClick={() => setFilter(state as "all" | "running" | "stopped")}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                filter === state
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {state.charAt(0).toUpperCase() + state.slice(1)}
            </button>
          ))}
        </div>

        {ec2Loading ? (
          <div className="text-gray-600">Loading EC2 instances...</div>
        ) : ec2Error ? (
          <div className="text-red-600">Error loading EC2 data.</div>
        ) : filteredEC2.length === 0 ? (
          <div className="text-gray-500">No instances found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredEC2.map((instance: any, index: number) => {
              const nameTag =
                instance.Tags?.find((tag: any) => tag.Key === "Name")?.Value || "Unnamed";
              const isRunning = instance.State === "running";

              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <Server className="w-5 h-5 text-blue-500" />
                      <span className="text-lg font-semibold text-gray-800">{nameTag}</span>
                    </div>
                    <div
                      className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
                        isRunning
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <CircleCheck className="w-4 h-4" /> <span>Running</span>
                        </>
                      ) : (
                        <>
                          <CircleX className="w-4 h-4" /> <span>Stopped</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mt-2">
                    <div><strong>Instance ID:</strong> {instance.InstanceId}</div>
                    <div className="flex items-center"><Cpu className="w-4 h-4 mr-1 text-gray-500" /><span>{instance.InstanceType}</span></div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-purple-500" /><span>{instance.AvailabilityZone}</span></div>
                    <div><strong>Private IP:</strong> {instance.PrivateIpAddress}</div>
                    <div><strong>Public IP:</strong> {instance.PublicIpAddress || "N/A"}</div>

                    <div className="flex items-start mt-1 gap-4">
                      <div>
                        <strong>Volumes:</strong>
                        <ul className="list-disc list-inside text-sm ml-2">
                          {instance.VolumeIds?.map((volId: string) => (
                            <li key={volId}>{volId}</li>
                          )) || <li>None</li>}
                        </ul>
                      </div>
                      <div>
                        <strong>Security Groups:</strong>
                        <ul className="list-disc list-inside ml-2">
                          {(instance.SecurityGroups as { GroupId: string; GroupName: string }[]).map((sg) => (
                            <li key={sg.GroupId}>
                              <code>{sg.GroupName}</code> ({sg.GroupId})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================== S3 ======================== */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">S3 Buckets</h2>
        {s3Loading ? (
          <div className="text-gray-600">Loading S3 buckets...</div>
        ) : s3Error ? (
          <div className="text-red-600">Error loading S3 buckets.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {s3Data?.map((bucket: any) => (
              <div
                key={bucket.Name}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FolderOpen className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-gray-800">{bucket.Name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div><strong>Region:</strong> {bucket.Region || "N/A"}</div>
                  <div><strong>Created:</strong> {bucket.CreationDate}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ======================== DynamoDB ======================== */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">DynamoDB Tables</h2>
        {dynamoLoading ? (
          <div className="text-gray-600">Loading DynamoDB tables...</div>
        ) : dynamoError ? (
          <div className="text-red-600">Error loading DynamoDB data.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {dynamoData?.map((table: any) => (
              <div
                key={table.TableName}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-semibold text-gray-800">{table.TableName}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Item Count:</strong> {table.ItemCount}</div>
                  <div><strong>Read Capacity:</strong> {table.ProvisionedThroughput?.ReadCapacityUnits}</div>
                  <div><strong>Write Capacity:</strong> {table.ProvisionedThroughput?.WriteCapacityUnits}</div>
                  <div><strong>Status:</strong> {table.TableStatus}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

