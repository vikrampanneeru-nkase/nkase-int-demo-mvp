import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ResourcesResponse, User } from "../types";

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
    accountId: string;
    description?: string; // Make description optional
  }) => void;
}

const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  resourceData,
  users,
  onSubmit,
}) => {
  const [accountId, setAccountId] = useState<string>("");
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<string>("Medium");
  const [cloud] = useState<string>("AWS");
  const [resourceType, setResourceType] = useState<string>("EC2");
  const [status, setStatus] = useState<string>("Open");
  const [accountName, setAccountName] = useState<string>("");
  const [description, setDescription] = useState<string>(""); // New state for description
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleResourceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedResource(selectedId);

    if (resourceType === "EC2" && resourceData?.EC2) {
      const selected = resourceData.EC2.find(
        (inst) => inst.InstanceId === selectedId
      );
      if (selected?.Tags) {
        const nameTag = selected.Tags.find((tag) => tag.Key === "Name");
        if (nameTag) setTitle(nameTag.Value);
        else setTitle(`EC2 - ${selectedId}`);
      } else {
        setTitle(`EC2 - ${selectedId}`);
      }
    } else if (resourceType === "S3" && resourceData?.S3) {
      const selected = resourceData.S3.find((b) => b.Name === selectedId);
      if (selected?.Name) {
        setTitle(`S3 Bucket - ${selected.Name}`);
      }
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!accountId) newErrors.accountId = "Account ID is required.";
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!priority) newErrors.priority = "Priority is required.";
    if (!status) newErrors.status = "Status is required.";
    if (!accountName) newErrors.accountName = "Assigned To is required.";

    if (accountId === "339751003344") {
      if (!resourceType) newErrors.resourceType = "Resource Type is required.";
      if (!selectedResource) newErrors.selectedResource = "Select a resource.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit?.({
      instanceId: selectedResource,
      title,
      priority,
      cloud,
      resourceType,
      status,
      accountName,
      accountId,
      description, // Pass description to API
    });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div
        className="flex items-center justify-center min-h-screen px-4"
        style={{ background: "rgba(0, 180, 255, 0.10)" }}
      >
        <div
          className="fixed inset-0"
          aria-hidden="true"
          style={{ background: "rgba(0, 180, 255, 0.10)" }}
        />
        <Dialog.Panel className="relative z-20 p-0 rounded-lg border bg-card text-card-foreground shadow-sm max-w-lg w-full">
          <div className="p-6">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-6 text-center">
              Add Resource
            </Dialog.Title>

            {/* Top Row: Cloud Provider & Account ID */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cloud Provider
                </label>
                <select
                  value={cloud}
                  disabled
                  className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm cursor-not-allowed"
                >
                  <option value="AWS">AWS</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account ID
                </label>
                <select
                  value={accountId}
                  onChange={(e) => {
                    setAccountId(e.target.value);
                    setSelectedResource("");
                    setTitle("");
                  }}
                  className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800"
                >
                  <option value="">-- Select Account ID --</option>
                  <option value="339751003344">339751003344</option>
                  <option value="123456789012">123456789012</option>
                </select>
                {errors.accountId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.accountId}
                  </p>
                )}
              </div>
            </div>

            {/* Resource Type & Select Resource (side by side if visible) */}
            {accountId === "339751003344" && (
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={resourceType}
                    onChange={(e) => {
                      setResourceType(e.target.value);
                      setSelectedResource("");
                      setTitle("");
                    }}
                    className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800"
                  >
                    <option value="EC2">EC2</option>
                    <option value="S3">S3</option>
                  </select>
                  {errors.resourceType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.resourceType}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Resource
                  </label>
                  <select
                    value={selectedResource}
                    onChange={handleResourceSelect}
                    className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800"
                  >
                    <option value="">-- Select --</option>
                    {resourceType === "EC2" &&
                      resourceData?.EC2.map((inst) => (
                        <option key={inst.InstanceId} value={inst.InstanceId}>
                          {inst.InstanceId}
                        </option>
                      ))}
                    {resourceType === "S3" &&
                      resourceData?.S3.map((bucket) => (
                        <option key={bucket.Name} value={bucket.Name}>
                          {bucket.Name}
                        </option>
                      ))}
                  </select>
                  {errors.selectedResource && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.selectedResource}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description (optional) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description{" "}
                <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800 min-h-[60px]"
                placeholder="Add any notes or description for this resource (optional)"
              />
            </div>

            {/* Priority & Status (side by side) */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
		<option value="Critical">Critical</option>
                </select>
                {errors.priority && (
                  <p className="text-red-500 text-xs mt-1">{errors.priority}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800"
                  disabled
                >
                  <option value="Open">Open</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                )}
              </div>
            </div>

            {/* Assigned To */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-1 font-sans tracking-wide">
                Assigned To
              </label>
              <select
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="block w-full border-gray-300 px-2 py-2 rounded-lg bg-white text-gray-900 shadow-sm font-sans text-base focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all"
              >
                <option value="">-- Assigned To --</option>
                {users.map((user) => (
                  <option
                    key={user.user_id}
                    value={user.account_name}
                    className="font-sans"
                  >
                    {user.account_name}
                  </option>
                ))}
              </select>
              {errors.accountName && (
                <p className="text-red-500 text-xs mt-1 font-sans">
                  {errors.accountName}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Buttons */}
          <div className="flex justify-between p-4 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-semibold"
            >
              Submit
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddResourceModal;

