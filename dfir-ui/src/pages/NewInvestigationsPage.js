import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AddResourceModal from "../components/AddResourceModal";
import { fetcher } from "../api/fetcher";
import apiClient from "@/api/client";
const tabs = [
    { label: "Overview", key: "overview" },
    { label: "Resources Under Investigation", key: "resources" },
    { label: "Evidence", key: "evidence" },
    { label: "Timeline", key: "timeline" },
    { label: "Investigation Tasks", key: "tasks" },
];
const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "N/A")
        return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
const fetchCaseDetails = async (case_number) => {
    return await fetcher(`investigations/${case_number}`);
};
const fetchAllResourceTypes = async () => {
    return await fetcher("investigations/resources/available");
};
const NewInvestigationsPage = () => {
    const { case_number } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("overview");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [resourceData, setResourceData] = useState(null);
    const { data, isLoading } = useQuery({
        queryKey: ["investigation", case_number],
        queryFn: () => fetchCaseDetails(case_number),
        enabled: !!case_number,
    });
    const emptyCase = {
        title: "New Investigation",
        priority: "N/A",
        status: "Draft",
        assigned_to: "Unassigned",
        description: "No case selected. Start a new investigation.",
        created_at: null,
        updated_at: null,
    };
    const defaultData = {
        case: emptyCase,
        tasks: [],
        timeline: [],
        resources: [],
    };
    const caseData = case_number ? data ?? defaultData : defaultData;
    const { case: caseDetails, tasks, timeline, resources = [] } = caseData;
    const { title, priority, status, assigned_to, description, created_at, updated_at } = caseDetails;
    const handleAddResource = async () => {
        const res = await fetchAllResourceTypes();
        setResourceData(res);
        setIsAddModalOpen(true);
    };
    const handleAddResourceSubmit = async (payload) => {
        try {
            const response = await apiClient.post("/investigations/cases/create", payload);
            const newCaseNumber = response.data.case_number;
            await queryClient.invalidateQueries({ queryKey: ["investigation", newCaseNumber] });
            console.log("✅ Case created or updated:", newCaseNumber);
            if (!case_number) {
                navigate(`/cases/${newCaseNumber}`);
            }
        }
        catch (err) {
            console.error("❌ Failed to create or update case:", err);
        }
    };
    if (isLoading && case_number) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-[#0f3d4d] to-[#2d2a80] text-white p-6", children: "Loading..." }));
    }
    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return _jsx("p", { children: description });
            case "resources":
                return (_jsxs(_Fragment, { children: [resources.length ? (_jsx("ul", { className: "space-y-3", children: resources.map((res) => (_jsxs("li", { className: "border p-3 rounded bg-white text-black", children: [_jsx("p", { className: "font-semibold", children: res.title }), _jsxs("p", { className: "text-sm", children: ["Type: ", res.resourceType] }), _jsxs("p", { className: "text-sm", children: ["Instance ID: ", res.instanceId] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Priority: ", res.priority] })] }, res.id))) })) : (_jsx("p", { children: "No resources linked yet." })), _jsx("button", { className: "mt-4 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700", onClick: handleAddResource, children: "\u2795 Add Resource" })] }));
            case "evidence":
                return _jsx("p", { children: "No evidence uploaded yet." });
            case "timeline":
                return timeline.length ? (_jsx("ul", { className: "list-disc pl-4", children: timeline.map((item, idx) => (_jsx("li", { children: JSON.stringify(item) }, idx))) })) : (_jsx("p", { children: "No timeline data." }));
            case "tasks":
                return tasks.length ? (_jsx("ul", { className: "space-y-3", children: tasks.map((task) => (_jsxs("li", { className: "border p-3 rounded bg-white text-black", children: [_jsx("p", { className: "font-semibold", children: task.title }), _jsx("p", { className: "text-sm", children: task.description }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Assigned to: ", task.assigned_to, " | Status: ", task.status] })] }, task.id))) })) : (_jsx("p", { children: "No tasks yet." }));
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-[#0f3d4d] to-[#2d2a80] text-white px-6 py-6 text-sm", children: [_jsx("h1", { className: "text-2xl font-semibold mb-1", children: title }), _jsxs("p", { className: "text-md text-gray-300 mb-3", children: ["Case #", case_number ?? "—"] }), _jsxs("div", { className: "flex gap-2 mb-6", children: [_jsx("span", { className: "bg-red-600 text-white px-3 py-1 rounded-full text-xs", children: priority }), _jsx("span", { className: "bg-cyan-600 text-white px-3 py-1 rounded-full text-xs", children: status })] }), _jsxs("div", { className: "flex justify-end gap-3 mb-6 flex-wrap", children: [_jsx("button", { className: "flex items-center gap-1 px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 text-sm", onClick: () => alert("Edit Case clicked"), children: "\u270F\uFE0F Edit Case" }), _jsx("button", { className: "flex items-center gap-1 px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 text-sm", onClick: () => alert("Generate Report clicked"), children: "\uD83D\uDCC4 Generate Report" }), _jsxs("div", { className: "relative group", children: [_jsx("button", { className: "flex items-center gap-1 px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 text-sm", children: "\u22EF Actions" }), _jsx("div", { className: "absolute hidden group-hover:block top-full mt-1 right-0 bg-white shadow-md rounded z-10", children: _jsxs("ul", { className: "text-sm text-black", children: [_jsx("li", { className: "px-4 py-2 hover:bg-gray-100 cursor-pointer", onClick: () => alert("Download Evidence"), children: "Download Evidence" }), _jsx("li", { className: "px-4 py-2 hover:bg-gray-100 cursor-pointer", onClick: () => alert("Reassign Case"), children: "Reassign Case" }), _jsx("li", { className: "px-4 py-2 hover:bg-gray-100 cursor-pointer", onClick: () => alert("Archive Case"), children: "Archive Case" })] }) })] }), _jsx("button", { className: "flex items-center gap-1 px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700 text-sm", onClick: () => alert("Communicate clicked"), children: "\uD83D\uDCAC Communicate" }), _jsx("button", { className: "flex items-center gap-1 px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm", onClick: () => alert("Isolate All Compromised Resources clicked"), children: "\uD83D\uDD12 Isolate All Compromised Resources" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "bg-cyan-100 text-black p-4 rounded-xl", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Assigned To" }), _jsxs("p", { className: "font-medium", children: ["\uD83D\uDC64 ", assigned_to] })] }), _jsxs("div", { className: "bg-cyan-100 text-black p-4 rounded-xl", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Created Date" }), _jsxs("p", { className: "font-medium", children: ["\uD83D\uDCC5 ", formatDate(created_at)] })] }), _jsxs("div", { className: "bg-cyan-100 text-black p-4 rounded-xl", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Last Updated" }), _jsxs("p", { className: "font-medium", children: ["\u23F1\uFE0F ", formatDate(updated_at)] })] })] }), _jsx("div", { className: "flex flex-wrap gap-3 mb-4", children: tabs.map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.key), className: `px-4 py-1.5 rounded-full text-sm font-medium ${activeTab === tab.key ? "bg-purple-700 text-white shadow" : "bg-cyan-100 text-black"}`, children: tab.label }, tab.key))) }), _jsx("div", { className: "bg-cyan-100 text-black p-4 rounded-xl mb-8", children: renderTabContent() }), resourceData && (_jsx(AddResourceModal, { isOpen: isAddModalOpen, onClose: () => setIsAddModalOpen(false), resourceData: resourceData, users: resourceData.Users, onSubmit: handleAddResourceSubmit }))] }));
};
export default NewInvestigationsPage;
