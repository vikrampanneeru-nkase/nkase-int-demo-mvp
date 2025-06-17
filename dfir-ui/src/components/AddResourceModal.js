import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
const AddResourceModal = ({ isOpen, onClose, resourceData, users, onSubmit, }) => {
    const [cloud, setCloud] = useState("AWS");
    const [resourceType, setResourceType] = useState("EC2");
    const [instanceId, setInstanceId] = useState("");
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [accountName, setAccountName] = useState("");
    const ec2Instances = resourceData?.EC2 || [];
    const s3Buckets = resourceData?.S3 || [];
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
    if (!isOpen)
        return null;
    return (_jsx(Dialog, { open: isOpen, onClose: onClose, className: "fixed z-50 inset-0 overflow-y-auto", children: _jsxs("div", { className: "flex items-center justify-center min-h-screen px-4", children: [_jsx("div", { className: "fixed inset-0 bg-black opacity-30" }), _jsxs("div", { className: "bg-white text-black rounded-xl shadow-xl p-6 max-w-lg w-full relative z-10", children: [_jsx(Dialog.Title, { className: "text-xl font-semibold mb-2", children: "Add Resource to Case" }), _jsx("p", { className: "text-sm text-gray-700 mb-4", children: "Enter details to create a new case and attach a cloud resource." }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Cloud Provider" }), _jsxs("select", { value: cloud, onChange: (e) => setCloud(e.target.value), className: "w-full border px-3 py-2 rounded bg-gray-50", children: [_jsx("option", { value: "AWS", children: "Amazon Web Services" }), _jsx("option", { value: "Azure", children: "Microsoft Azure" }), _jsx("option", { value: "GCP", children: "Google Cloud Platform" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Resource Type" }), _jsxs("select", { value: resourceType, onChange: (e) => {
                                        setResourceType(e.target.value);
                                        setInstanceId("");
                                        setTitle("");
                                    }, className: "w-full border px-3 py-2 rounded bg-gray-50", children: [_jsx("option", { value: "EC2", children: "EC2 Instance / Virtual Machine" }), _jsx("option", { value: "S3", children: "Storage (S3)" }), _jsx("option", { value: "DynamoDB", children: "DynamoDB" }), _jsx("option", { value: "Network", children: "Network Resource" })] })] }), resourceType === "EC2" && (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Instance ID" }), _jsxs("select", { value: instanceId, onChange: (e) => {
                                        const selected = ec2Instances.find((inst) => inst.InstanceId === e.target.value);
                                        setInstanceId(e.target.value);
                                        if (selected?.Tags) {
                                            const nameTag = selected.Tags.find((tag) => tag.Key === "Name");
                                            if (nameTag?.Value) {
                                                setTitle(`EC2 - ${nameTag.Value}`);
                                            }
                                        }
                                    }, className: "w-full border px-3 py-2 rounded bg-white", children: [_jsx("option", { value: "", children: "-- Select Instance --" }), ec2Instances.map((inst) => (_jsx("option", { value: inst.InstanceId, children: inst.InstanceId }, inst.InstanceId)))] })] })), resourceType === "S3" && (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Bucket" }), _jsxs("select", { value: instanceId, onChange: (e) => {
                                        const selected = s3Buckets.find((b) => b.Name === e.target.value);
                                        setInstanceId(e.target.value);
                                        if (selected?.Name) {
                                            setTitle(`S3 Bucket - ${selected.Name}`);
                                        }
                                    }, className: "w-full border px-3 py-2 rounded bg-white", children: [_jsx("option", { value: "", children: "-- Select Bucket --" }), s3Buckets.map((bucket) => (_jsx("option", { value: bucket.Name, children: bucket.Name }, bucket.Name)))] })] })), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Resource Title" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "e.g., WebServer-Main", className: "w-full border px-3 py-2 rounded bg-white" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Priority" }), _jsxs("select", { value: priority, onChange: (e) => setPriority(e.target.value), className: "w-full border px-3 py-2 rounded bg-white", children: [_jsx("option", { children: "Low" }), _jsx("option", { children: "Medium" }), _jsx("option", { children: "High" }), _jsx("option", { children: "Critical" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Account" }), _jsxs("select", { value: accountName, onChange: (e) => setAccountName(e.target.value), className: "w-full border px-3 py-2 rounded bg-white", children: [_jsx("option", { value: "", children: "-- Select Account --" }), users.map((user) => (_jsx("option", { value: user.account_name, children: user.account_name }, user.user_id)))] })] }), _jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm", children: "Cancel" }), _jsx("button", { onClick: handleSubmit, className: "px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm", children: "Submit" })] })] })] }) }));
};
export default AddResourceModal;
