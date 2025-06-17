import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import type { User, ResourcesResponse, EC2Instance, S3Bucket } from "../types";

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceData: ResourcesResponse | null;
  users: User[];
  onSubmit?: (payload: {
    instanceId: string;
    title: string;
    priority: string;
    cloud: string;
    resourceType: string;
    status: string;
    accountName: string;
  }) => void;
}

const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  resourceData,
  users,
  onSubmit,
}) => {
  const [cloud, setCloud] = useState("AWS");
  const [resourceType, setResourceType] = useState("EC2");
  const [instanceId, setInstanceId] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [accountName, setAccountName] = useState("");

  const ec2Instances: EC2Instance[] = resourceData?.EC2 || [];
  const s3Buckets: S3Bucket[] = resourceData?.S3 || [];

  const handleSubmit = () => {
    if (!instanceId || !title || !priority || !accountName) {
      alert("Please fill in all fields.");
      return;
    }

    onSubmit?.({
      instanceId,
      title,
      priority,
      cloud,
      resourceType,
      status: "Open",
      accountName,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white text-black rounded-xl shadow-xl p-6 max-w-lg w-full relative z-10">
          <Dialog.Title className="text-xl font-semibold mb-2">Add Resource to Case</Dialog.Title>
          <p className="text-sm text-gray-700 mb-4">
            Enter details to create a new case and attach a cloud resource.
          </p>

          {/* Cloud Provider */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cloud Provider</label>
            <select
              value={cloud}
              onChange={(e) => setCloud(e.target.value)}
              className="w-full border px-3 py-2 rounded bg-gray-50"
            >
              <option value="AWS">Amazon Web Services</option>
              <option value="Azure">Microsoft Azure</option>
              <option value="GCP">Google Cloud Platform</option>
            </select>
          </div>

          {/* Resource Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
            <select
              value={resourceType}
              onChange={(e) => {
                setResourceType(e.target.value);
                setInstanceId("");
                setTitle("");
              }}
              className="w-full border px-3 py-2 rounded bg-gray-50"
            >
              <option value="EC2">EC2 Instance / Virtual Machine</option>
              <option value="S3">Storage (S3)</option>
              <option value="DynamoDB">DynamoDB</option>
              <option value="Network">Network Resource</option>
            </select>
          </div>

          {/* Resource-Specific Dropdown */}
          {resourceType === "EC2" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instance ID</label>
              <select
                value={instanceId}
                onChange={(e) => {
                  const selected: EC2Instance | undefined = ec2Instances.find(
                    (inst) => inst.InstanceId === e.target.value
                  );
                  setInstanceId(e.target.value);
                  if (selected?.Tags) {
                    const nameTag = selected.Tags.find((tag) => tag.Key === "Name");
                    if (nameTag?.Value) {
                      setTitle(`EC2 - ${nameTag.Value}`);
                    }
                  }
                }}
                className="w-full border px-3 py-2 rounded bg-white"
              >
                <option value="">-- Select Instance --</option>
                {ec2Instances.map((inst) => (
                  <option key={inst.InstanceId} value={inst.InstanceId}>
                    {inst.InstanceId}
                  </option>
                ))}
              </select>
            </div>
          )}

          {resourceType === "S3" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bucket</label>
              <select
                value={instanceId}
                onChange={(e) => {
                  const selected: S3Bucket | undefined = s3Buckets.find(
                    (b) => b.Name === e.target.value
                  );
                  setInstanceId(e.target.value);
                  if (selected?.Name) {
                    setTitle(`S3 Bucket - ${selected.Name}`);
                  }
                }}
                className="w-full border px-3 py-2 rounded bg-white"
              >
                <option value="">-- Select Bucket --</option>
                {s3Buckets.map((bucket) => (
                  <option key={bucket.Name} value={bucket.Name}>
                    {bucket.Name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Manual Title Fallback */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., WebServer-Main"
              className="w-full border px-3 py-2 rounded bg-white"
            />
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          {/* Account Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
            <select
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              <option value="">-- Select Account --</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.account_name}>
                  {user.account_name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddResourceModal;

