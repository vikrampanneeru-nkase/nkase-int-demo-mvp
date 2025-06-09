import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import QuarantineTab from "./QuarantineTab";
import MitigationTab from "./MitigationTab";
export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("quarantine");
    return (_jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-3xl font-bold mb-6 text-gray-800", children: "Activity Log Dashboard" }), _jsxs("div", { className: "flex space-x-4 mb-6", children: [_jsx("button", { className: `px-4 py-2 rounded ${activeTab === "quarantine" ? "bg-blue-600 text-white" : "bg-gray-200"}`, onClick: () => setActiveTab("quarantine"), children: "Quarantine" }), _jsx("button", { className: `px-4 py-2 rounded ${activeTab === "mitigation" ? "bg-blue-600 text-white" : "bg-gray-200"}`, onClick: () => setActiveTab("mitigation"), children: "Mitigation" })] }), activeTab === "quarantine" ? _jsx(QuarantineTab, {}) : _jsx(MitigationTab, {})] }));
}
