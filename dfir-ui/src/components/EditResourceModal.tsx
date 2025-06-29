import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { User } from "../types";

interface EditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any | null; // Pass the case data to edit
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
    description?: string;
  }) => void;
}

const EditResourceModal: React.FC<EditResourceModalProps> = ({
  isOpen,
  onClose,
  caseData,
  users,
  onSubmit,
}) => {
  const [instanceId, setInstanceId] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [cloud] = useState("AWS");
  const [resourceType, setResourceType] = useState("EC2");
  const [status, setStatus] = useState("Open");
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    if (caseData) {
      setInstanceId(caseData.instance_id || "");
      setTitle(caseData.title || "");
      setPriority(caseData.priority || "Medium");
      setResourceType(caseData.resource_type || "EC2");
      setStatus(caseData.status || "Open");
      setAccountName(caseData.assigned_to || "");
      setAccountId(caseData.accountId || "");
      setDescription(caseData.description || "");
    }
  }, [caseData, isOpen]);

  // Always use a fallback for users from caseData if users is empty
  const effectiveUsers: User[] = (users && users.length > 0)
    ? users
    : (caseData?.Users && Array.isArray(caseData.Users) ? caseData.Users : []);

  useEffect(() => {
    setFilteredUsers(
      accountId ? effectiveUsers.filter((u) => String(u.account_id) === String(accountId)) : effectiveUsers
    );
  }, [effectiveUsers, accountId]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!accountId) newErrors.accountId = "Account ID is required.";
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!priority) newErrors.priority = "Priority is required.";
    if (!status) newErrors.status = "Status is required.";
    if (!accountName) newErrors.accountName = "Assigned To is required.";
    if (!resourceType) newErrors.resourceType = "Resource Type is required.";
    if (!instanceId) newErrors.instanceId = "Instance ID is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onSubmit?.({
      instanceId,
      title,
      priority,
      cloud,
      resourceType,
      status,
      accountName,
      accountId,
      description,
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
              Edit Case
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
                    setAccountName(""); // Reset assigned to when account changes
                  }}
                  className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800"
                >
                  <option value="">-- Select Account ID --</option>
                  {Array.from(new Set(effectiveUsers.map((u) => String(u.account_id)))).map((id) => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
                {errors.accountId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.accountId}
                  </p>
                )}
              </div>
            </div>
            {/* Resource Type & Instance ID */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Type
                </label>
                <select
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800"
                  disabled
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
                  Instance ID
                </label>
                <input
                  type="text"
                  value={instanceId}
                  onChange={(e) => setInstanceId(e.target.value)}
                  className="block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800"
                  disabled
                />
                {errors.instanceId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.instanceId}
                  </p>
                )}
              </div>
            </div>
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
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                  <option value="Error">Error</option>
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
                {filteredUsers.map((user) => (
                  <option
                    key={String(user.user_id)}
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
              Save Changes
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditResourceModal;

