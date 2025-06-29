import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
const AddResourceModal = ({ isOpen, onClose, resourceData, users, onSubmit, }) => {
    const [accountId, setAccountId] = useState("");
    const [selectedResource, setSelectedResource] = useState("");
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [cloud] = useState("AWS");
    const [resourceType, setResourceType] = useState("EC2");
    const [status, setStatus] = useState("Open");
    const [accountName, setAccountName] = useState("");
    const [description, setDescription] = useState(""); // New state for description
    const [errors, setErrors] = useState({});
    const handleResourceSelect = (e) => {
        const selectedId = e.target.value;
        setSelectedResource(selectedId);
        if (resourceType === "EC2" && resourceData?.EC2) {
            const selected = resourceData.EC2.find((inst) => inst.InstanceId === selectedId);
            if (selected?.Tags) {
                const nameTag = selected.Tags.find((tag) => tag.Key === "Name");
                if (nameTag)
                    setTitle(nameTag.Value);
                else
                    setTitle(`EC2 - ${selectedId}`);
            }
            else {
                setTitle(`EC2 - ${selectedId}`);
            }
        }
        else if (resourceType === "S3" && resourceData?.S3) {
            const selected = resourceData.S3.find((b) => b.Name === selectedId);
            if (selected?.Name) {
                setTitle(`S3 Bucket - ${selected.Name}`);
            }
        }
    };
    const handleSubmit = () => {
        const newErrors = {};
        if (!accountId)
            newErrors.accountId = "Account ID is required.";
        if (!title.trim())
            newErrors.title = "Title is required.";
        if (!priority)
            newErrors.priority = "Priority is required.";
        if (!status)
            newErrors.status = "Status is required.";
        if (!accountName)
            newErrors.accountName = "Assigned To is required.";
        if (accountId === "339751003344") {
            if (!resourceType)
                newErrors.resourceType = "Resource Type is required.";
            if (!selectedResource)
                newErrors.selectedResource = "Select a resource.";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0)
            return;
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
    return (_jsx(Dialog, { open: isOpen, onClose: onClose, className: "fixed z-10 inset-0 overflow-y-auto", children: _jsxs("div", { className: "flex items-center justify-center min-h-screen px-4", style: { background: "rgba(0, 180, 255, 0.10)" }, children: [_jsx("div", { className: "fixed inset-0", "aria-hidden": "true", style: { background: "rgba(0, 180, 255, 0.10)" } }), _jsxs(Dialog.Panel, { className: "relative z-20 p-0 rounded-lg border bg-card text-card-foreground shadow-sm max-w-lg w-full", children: [_jsxs("div", { className: "p-6", children: [_jsx(Dialog.Title, { className: "text-xl font-bold text-gray-900 mb-6 text-center", children: "Add Resource" }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Cloud Provider" }), _jsx("select", { value: cloud, disabled: true, className: "block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm cursor-not-allowed", children: _jsx("option", { value: "AWS", children: "AWS" }) })] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Account ID" }), _jsxs("select", { value: accountId, onChange: (e) => {
                                                        setAccountId(e.target.value);
                                                        setSelectedResource("");
                                                        setTitle("");
                                                    }, className: "block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800", children: [_jsx("option", { value: "", children: "-- Select Account ID --" }), _jsx("option", { value: "339751003344", children: "339751003344" }), _jsx("option", { value: "123456789012", children: "123456789012" })] }), errors.accountId && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.accountId }))] })] }), accountId === "339751003344" && (_jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Resource Type" }), _jsxs("select", { value: resourceType, onChange: (e) => {
                                                        setResourceType(e.target.value);
                                                        setSelectedResource("");
                                                        setTitle("");
                                                    }, className: "block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800", children: [_jsx("option", { value: "EC2", children: "EC2" }), _jsx("option", { value: "S3", children: "S3" })] }), errors.resourceType && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.resourceType }))] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Select Resource" }), _jsxs("select", { value: selectedResource, onChange: handleResourceSelect, className: "block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800", children: [_jsx("option", { value: "", children: "-- Select --" }), resourceType === "EC2" &&
                                                            resourceData?.EC2.map((inst) => (_jsx("option", { value: inst.InstanceId, children: inst.InstanceId }, inst.InstanceId))), resourceType === "S3" &&
                                                            resourceData?.S3.map((bucket) => (_jsx("option", { value: bucket.Name, children: bucket.Name }, bucket.Name)))] }), errors.selectedResource && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.selectedResource }))] })] })), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Title" }), _jsx("input", { type: "text", value: title, onChange: (e) => setTitle(e.target.value), className: "block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800" }), errors.title && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.title }))] }), _jsxs("div", { className: "mb-4", children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: ["Description", " ", _jsx("span", { className: "text-gray-400 text-xs", children: "(optional)" })] }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), className: "block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800 min-h-[60px]", placeholder: "Add any notes or description for this resource (optional)" })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Priority" }), _jsxs("select", { value: priority, onChange: (e) => setPriority(e.target.value), className: "block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800", children: [_jsx("option", { value: "Low", children: "Low" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "High", children: "High" }), _jsx("option", { value: "Critical", children: "Critical" })] }), errors.priority && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.priority }))] }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsx("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "block w-full border-gray-300 px-2 py-1 rounded-lg bg-card text-card-foreground shadow-sm text-gray-800", disabled: true, children: _jsx("option", { value: "Open", children: "Open" }) }), errors.status && (_jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.status }))] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-800 mb-1 font-sans tracking-wide", children: "Assigned To" }), _jsxs("select", { value: accountName, onChange: (e) => setAccountName(e.target.value), className: "block w-full border-gray-300 px-2 py-2 rounded-lg bg-white text-gray-900 shadow-sm font-sans text-base focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all", children: [_jsx("option", { value: "", children: "-- Assigned To --" }), users.map((user) => (_jsx("option", { value: user.account_name, className: "font-sans", children: user.account_name }, user.user_id)))] }), errors.accountName && (_jsx("p", { className: "text-red-500 text-xs mt-1 font-sans", children: errors.accountName }))] })] }), _jsx("div", { className: "border-t border-gray-200" }), _jsxs("div", { className: "flex justify-between p-4 bg-gray-50 rounded-b-xl", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100", children: "Cancel" }), _jsx("button", { onClick: handleSubmit, className: "px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 font-semibold", children: "Submit" })] })] })] }) }));
};
export default AddResourceModal;
