import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AddResourceModal from "../components/AddResourceModal";
import MalwareAnalysisDialog from "../components/MalwareAnalysisDialog";
import MalwareAnalysisTerminalBox from "../components/MalwareAnalysisTerminalBox";
import EditResourceModal from "../components/EditResourceModal";
import { fetcher } from "../api/fetcher";
import apiClient from "@/api/client";
import { ShieldAlert, Trash2, Shield, ShieldOff, } from "lucide-react";
const tabs = [
    { label: "Overview", key: "overview" },
    { label: "Resources Under Investigation", key: "resources" },
    { label: "Evidence", key: "evidence" },
    { label: "Timeline", key: "timeline" },
    { label: "Investigation Tasks", key: "tasks" },
    { label: "Reports", key: "reports" },
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
const fetchNonClosedCases = async () => {
    return await fetcher("investigations/cases/open");
};
const NewInvestigationsPage = () => {
    const { case_number: paramsCaseNumber } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("overview");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [resourceData, setResourceData] = useState(null);
    const [nonClosedCasesEnabled, setNonClosedCasesEnabled] = useState(false);
    const [isMalwareDialogOpen, setIsMalwareDialogOpen] = useState(false);
    const [pendingPayload, setPendingPayload] = useState(null);
    const [malwareTerminalOpen, setMalwareTerminalOpen] = useState(false);
    const [malwareDialogCaseNumber, setMalwareDialogCaseNumber] = useState(null);
    const [openDropdownCase, setOpenDropdownCase] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false });
    const [processingInstanceIds, setProcessingInstanceIds] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["investigation", paramsCaseNumber],
        queryFn: () => fetchCaseDetails(paramsCaseNumber),
        enabled: !!paramsCaseNumber,
    });
    const { data: nonClosedCases, isFetching: isFetchingNonClosed } = useQuery({
        queryKey: ["nonClosedCases"],
        queryFn: fetchNonClosedCases,
        enabled: nonClosedCasesEnabled,
    });
    const emptyCase = {
        case_number: "",
        title: "New Investigation",
        description: "No case selected. Start a new investigation.",
        priority: "N/A",
        status: "Draft",
        assigned_to: "Unassigned",
        created_at: null,
        updated_at: null,
        due_date: null,
        instance_id: "",
        accountId: "",
        accountName: "",
        resource_type: "",
        cloud: "",
    };
    const defaultData = {
        case: emptyCase,
        tasks: [],
        timeline: [],
        findings: [],
        reports: [],
        resources: [],
    };
    const caseData = paramsCaseNumber ? data ?? defaultData : defaultData;
    const { case: caseDetails, tasks, timeline, findings, reports } = caseData;
    const resources = caseData.resources ?? [];
    const { case_number, title, description, priority, status, assigned_to, created_at, updated_at, due_date, instance_id, accountId, accountName, resource_type, cloud, } = caseDetails;
    // Use destructuring for all fields, but avoid redeclaring case_number if already declared from useParams
    const caseDetailsFields = {
        title: caseDetails.title,
        priority: caseDetails.priority,
        status: caseDetails.status,
        assigned_to: caseDetails.assigned_to,
        description: caseDetails.description,
        created_at: caseDetails.created_at,
        updated_at: caseDetails.updated_at,
        due_date: caseDetails.due_date,
        instance_id: caseDetails.instance_id,
        accountId: caseDetails.accountId,
        accountName: caseDetails.accountName,
        resource_type: caseDetails.resource_type,
        cloud: caseDetails.cloud,
    };
    const MenuItem = ({ icon, label, danger = false, onClick }) => (_jsxs("div", { className: `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-[#caf2f4] ${danger ? "text-red-600" : "text-gray-800"}`, onClick: onClick, children: [icon, _jsx("span", { children: label })] }));
    const SubMenu = ({ icon, label, children, }) => {
        const [isOpen, setIsOpen] = useState(false);
        const toggleMenu = () => {
            setIsOpen((prev) => !prev);
        };
        return (_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-800", onClick: toggleMenu, children: [icon, _jsx("span", { className: "ml-2", children: label })] }), isOpen && (_jsx("div", { className: "absolute left-full top-0 mt-0 ml-1 w-64 bg-white border rounded-lg shadow-xl z-50", children: children }))] }));
    };
    const ResourceDropdown = ({ onClose, caseNumber, resource, }) => {
        const [showConfirm, setShowConfirm] = useState(false);
        const [localProcessing, setLocalProcessing] = useState(false);
        const handleAction = async (actionType) => {
            if (actionType === "isolate") {
                setShowConfirm("isolate");
                return;
            }
            if (actionType === "deisolate") {
                setShowConfirm("deisolate");
                return;
            }
            console.log(`Performing action: ${actionType} on case ${caseNumber}`);
            if (actionType === "malware_analysis") {
                // Print debug log before opening dialog
                console.log("[DEBUG] Posting to /investigations/nkase/action", {
                    case_number: caseNumber,
                    action: actionType,
                });
                onClose?.();
                setMalwareDialogCaseNumber(caseNumber); // Store the correct case_number
                setIsMalwareDialogOpen(true);
                return;
            }
            try {
                console.log("[DEBUG] Posting to /investigations/nkase/action", {
                    case_number: caseNumber,
                    action: actionType,
                });
                const response = await apiClient.post("/investigations/nkase/action", {
                    case_number: caseNumber,
                    action: actionType,
                });
                console.log("✅ Action successful:", response.data);
            }
            catch (error) {
                console.error("❌ Action failed:", error);
            }
            finally {
                onClose?.();
            }
        };
        const handleConfirmIsolate = async () => {
            setShowConfirm(false);
            setLocalProcessing(true);
            setProcessingInstanceIds((prev) => [
                ...prev,
                resource.instance_id || resource.instanceId,
            ]);
            try {
                const resp = await apiClient.post("/investigations/Quarantine", {
                    case_number: caseNumber,
                    action: "isolate",
                    instance_id: resource.instance_id || resource.instanceId || undefined,
                });
                const result = resp.data;
                if (Array.isArray(result) &&
                    result[0]?.startsWith("Isolate success:")) {
                    setSuccessMessage(`Instance ${resource.instance_id || resource.instanceId} Quarantine successfully.`);
                }
                await queryClient.invalidateQueries({ queryKey: ["nonClosedCases"] });
                onClose?.(); // <-- Ensure dropdown closes after action
            }
            catch (error) {
                console.error("❌ Isolation failed:", error);
            }
            finally {
                setLocalProcessing(false);
                setProcessingInstanceIds((prev) => prev.filter((id) => id !== (resource.instance_id || resource.instanceId)));
            }
        };
        // Only show the dropdown if no confirmation dialog is open
        if (showConfirm === "isolate") {
            return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 min-w-[320px]", children: [_jsx("h2", { className: "text-lg font-semibold mb-2 text-gray-900", children: "Confirm Isolation" }), _jsx("p", { className: "mb-4 text-gray-700", children: "Do you want to isolate this instance?" }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { className: "px-4 py-1.5 rounded bg-gray-200 text-gray-800 hover:bg-gray-300", onClick: () => setShowConfirm(false), children: "No" }), _jsx("button", { className: "px-4 py-1.5 rounded bg-red-600 text-white hover:bg-red-700", onClick: handleConfirmIsolate, children: localProcessing ? "Processing..." : "Yes, Isolate" })] })] }) }));
        }
        if (showConfirm === "deisolate") {
            return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 min-w-[320px]", children: [_jsx("h2", { className: "text-lg font-semibold mb-2 text-gray-900", children: "Confirm De-isolation" }), _jsx("p", { className: "mb-4 text-gray-700", children: "Do you want to de-isolate this instance?" }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { className: "px-4 py-1.5 rounded bg-gray-200 text-gray-800 hover:bg-gray-300", onClick: () => setShowConfirm(false), children: "No" }), _jsx("button", { className: "px-4 py-1.5 rounded bg-cyan-600 text-white hover:bg-cyan-700", onClick: async () => {
                                        setShowConfirm(false);
                                        setLocalProcessing(true);
                                        setProcessingInstanceIds((prev) => [
                                            ...prev,
                                            resource.instance_id || resource.instanceId,
                                        ]);
                                        try {
                                            const resp = await apiClient.post("/investigations/un-Quarantine", {
                                                case_number: caseNumber,
                                                action: "deisolate",
                                                instance_id: resource.instance_id ||
                                                    resource.instanceId ||
                                                    undefined,
                                            });
                                            const result = resp.data;
                                            let foundSuccess = false;
                                            if (Array.isArray(result)) {
                                                foundSuccess = result.some((msg) => isDeisolateSuccess(msg));
                                            }
                                            else if (typeof result === "string") {
                                                foundSuccess = isDeisolateSuccess(result);
                                            }
                                            if (foundSuccess) {
                                                setSuccessMessage(`Instance ${resource.instance_id || resource.instanceId} Dequarantine successfully.`);
                                            }
                                            await queryClient.invalidateQueries({
                                                queryKey: ["nonClosedCases"],
                                            });
                                            onClose?.();
                                        }
                                        catch (error) {
                                            console.error("❌ De-isolation failed:", error);
                                        }
                                        finally {
                                            setLocalProcessing(false);
                                            setProcessingInstanceIds((prev) => prev.filter((id) => id !== (resource.instance_id || resource.instanceId)));
                                        }
                                    }, children: localProcessing ? "Processing..." : "Yes, De-isolate" })] })] }) }));
        }
        return (_jsxs("div", { className: "absolute right-0 z-50 mt-2 w-64 bg-[#e0f9fb] border rounded-xl shadow-xl p-2", children: [_jsx("p", { className: "px-3 py-1 text-sm font-semibold text-gray-700", children: "Resource Actions" }), _jsx(SubMenu, { icon: _jsx(ShieldAlert, { size: 16 }), label: "Forensic Analysis", children: _jsx(MenuItem, { icon: _jsx(Shield, { size: 16 }), label: "Malware Analysis", onClick: () => handleAction("malware_analysis") }) }), resource.isquarantine !== "Y" && (_jsx(MenuItem, { icon: _jsx(Shield, { size: 16 }), label: "Quarantine", onClick: () => handleAction("isolate") })), resource.isquarantine !== "N" && (_jsx(MenuItem, { icon: _jsx(ShieldOff, { size: 16 }), label: "Dequarantine", onClick: () => handleAction("deisolate"), disabled: resource.isquarantine !== "Y" })), _jsx("div", { className: "border-t border-gray-200 my-1" }), _jsx(MenuItem, { icon: _jsx(Trash2, { size: 16, className: "text-red-500" }), label: "Destroy Resource", danger: true, onClick: () => handleAction("destroy_resource") })] }));
    };
    const handleTabChange = (key) => {
        setActiveTab(key);
        if (key === "resources") {
            setNonClosedCasesEnabled(false); // Always refetch on tab click
            setTimeout(() => setNonClosedCasesEnabled(true), 0); // Force re-trigger fetch
        }
        else {
            setNonClosedCasesEnabled(false);
        }
    };
    const handleAddResource = async () => {
        const res = await fetchAllResourceTypes();
        setResourceData(res);
        setIsAddModalOpen(true);
    };
    const handleEditCase = async () => {
        console.log("✏️ Edit Case clicked", case_number);
        setIsEditModalOpen(true);
    };
    const handleGenerateReport = () => {
        console.log("📄 Generate Report clicked", case_number);
        // Generate or download PDF
    };
    const handleMoreActions = () => {
        console.log("⋮ More Actions clicked");
        // Open dropdown or modal
    };
    const handleCommunicate = () => {
        console.log("💬 Communicate clicked");
        // Open chat or message modal
    };
    const handleIsolateResources = async () => {
        console.log("🔒 Isolate All clicked", case_number);
        try {
            await apiClient.post("/investigations/actions/isolate", {
                case_number,
            });
            alert("✅ All compromised resources isolated.");
        }
        catch (error) {
            console.error("❌ Isolation failed", error);
            alert("❌ Failed to isolate resources.");
        }
    };
    const handleAddResourceSubmit = async (payload) => {
        try {
            const response = await apiClient.post("/investigations/cases/create", payload);
            const data = response.data;
            const newCaseNumber = data.case_number;
            await queryClient.invalidateQueries({
                queryKey: ["investigation", newCaseNumber],
            });
            await queryClient.invalidateQueries({
                queryKey: ["nonClosedCases"],
            });
            if (!case_number || case_number !== newCaseNumber) {
                navigate(`/newinvestigations/${newCaseNumber}`);
            }
            setActiveTab("resources");
            setIsAddModalOpen(false);
        }
        catch (err) {
            console.error("❌ Failed to create or update case:", err);
        }
    };
    const handleStartMalwareAnalysis = async () => {
        try {
            setMalwareTerminalOpen(true);
            await apiClient.post("/investigations/nkase/action", {
                case_number: malwareDialogCaseNumber, // Use the correct case_number from state
                action: "malware_analysis",
            });
            setIsMalwareDialogOpen(false);
            // MalwareAnalysisTerminalBox will handle log streaming
        }
        catch (error) {
            setMalwareTerminalOpen(false);
            console.error("❌ Malware analysis failed:", error);
        }
    };
    const InvestigationCard = ({ inv }) => {
        const [dropdownOpen, setDropdownOpen] = useState(false);
        return (_jsxs("div", { className: "relative bg-white p-4 rounded-xl border shadow hover:bg-gray-50 min-w-[300px]", children: [_jsxs("p", { className: "font-semibold text-sm", children: ["\uD83E\uDDE9 ", inv.title] }), _jsxs("p", { className: "text-xs text-gray-600", children: ["Case #: ", inv.case_number] }), _jsxs("p", { className: "text-xs text-gray-600", children: ["Status: ", inv.status] }), _jsxs("p", { className: "text-xs text-gray-600", children: ["Assigned To: ", inv.assigned_to || "Unassigned"] }), _jsxs("p", { className: "text-xs text-gray-600", children: ["Updated: ", formatDate(inv.updated_at)] }), _jsxs("div", { className: "mt-2 relative flex justify-end", children: [_jsx("button", { onClick: () => setDropdownOpen((prev) => !prev), className: "inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 text-sm bg-[#caf2f4] font-medium text-gray-700 hover:bg-cyan-100", children: "Actions" }), dropdownOpen && (_jsx("div", { className: "absolute right-0 top-full mt-1 z-10 w-40 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5", children: _jsx(ResourceDropdown, { onClose: () => setDropdownOpen(false), caseNumber: inv.case_number, resource: inv }) }))] })] }));
    };
    // ResourceCard for each resource in Resources tab
    const ResourceCard = ({ res, caseNumber, }) => {
        const [dropdownOpen, setDropdownOpen] = React.useState(false);
        return (_jsxs("div", { className: "bg-white text-black p-6 rounded-xl border shadow relative flex flex-col gap-2 min-w-[320px]", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "font-semibold text-lg", children: res.title || res.instanceId || res.instance_id || "Resource" }), _jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setDropdownOpen((prev) => !prev), className: "inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-1 text-sm bg-[#caf2f4] font-medium text-gray-700 hover:bg-cyan-100", children: "Actions" }), dropdownOpen && (_jsx("div", { className: "absolute right-0 top-full mt-1 z-10 w-40 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5", children: _jsx(ResourceDropdown, { onClose: () => setDropdownOpen(false), caseNumber: caseNumber, resource: res }) }))] })] }), _jsxs("div", { className: "border rounded-lg bg-gray-50 p-4 grid grid-cols-2 gap-x-4 gap-y-2", children: [_jsx("div", { className: "text-gray-600 font-semibold", children: "Case #" }), _jsx("div", { className: "font-mono", children: res.case_number || "-" }), _jsx("div", { className: "text-gray-600 font-semibold", children: "Instance Id" }), _jsx("div", { className: "font-mono", children: res.instance_id || res.instanceId || "-" }), _jsx("div", { className: "text-gray-600 font-semibold", children: "Account Id" }), _jsx("div", { className: "font-mono", children: res.accountId || res.account_id || "-" }), _jsx("div", { className: "text-gray-600 font-semibold", children: "Assigned To" }), _jsx("div", { className: "font-mono", children: res.assigned_to || "-" }), _jsx("div", { className: "text-gray-600 font-semibold", children: "Type" }), _jsx("div", { children: res.resourceType || res.resource_type || "-" }), _jsx("div", { className: "text-gray-600 font-semibold", children: "Title" }), _jsx("div", { children: res.title || "-" })] }), processingInstanceIds.includes(res.instance_id || res.instanceId) ? (_jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx("span", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-700" }), _jsx("span", { className: "text-cyan-700 text-xs", children: res.isquarantine === "Y" && res.isquarantine !== undefined
                                ? "Quarantine in progress..."
                                : res.isquarantine === "N" && res.isquarantine !== undefined
                                    ? "De-isolation in progress..."
                                    : "Isolation in progress..." })] })) : res.isquarantine === "Y" ? (_jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx(ShieldAlert, { className: "text-red-600", size: 16 }), _jsx("span", { className: "text-red-700 text-xs font-semibold", children: "Instance Quarantined" })] })) : null] }));
    };
    const renderTabContent = () => {
        switch (activeTab) {
            case "overview":
                return (_jsxs("div", { className: "bg-cyan-100 px-6 py-4 rounded-md", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Case Description" }), _jsx("p", { className: "text-sm text-gray-800", children: description || "No description available." })] }));
            case "resources":
                const resourceList = Array.isArray(nonClosedCases) && nonClosedCases.length > 0
                    ? nonClosedCases
                    : Array.isArray(resources)
                        ? resources
                        : [];
                return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("p", { className: "text-lg text-gray-500 mb-0", children: resourceList.length === 0
                                        ? "No resources linked yet."
                                        : "Resources Under Investigation" }), _jsx("button", { className: "bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-cyan-700 transition", onClick: handleAddResource, children: "\u2795 Add Resource" })] }), _jsx("hr", { className: "my-6 border-gray-300" }), resourceList.length > 0 ? (_jsx("div", { className: "flex flex-col gap-6", children: resourceList.map((res, idx) => (_jsx(ResourceCard, { res: res, caseNumber: res.case_number }, res.case_number || res.instanceId || res.instance_id || idx))) })) : null] }));
            case "evidence":
                return (_jsxs("div", { children: [_jsx("p", { className: "text-base font-medium mb-2", children: "\uD83E\uDDFE Evidence / Findings" }), _jsx("pre", { className: "text-xs bg-gray-100 text-black p-2 rounded", children: JSON.stringify(findings, null, 2) })] }));
            case "timeline":
                return (_jsxs("div", { children: [_jsx("p", { className: "text-base font-medium mb-2", children: "\uD83D\uDCC5 Timeline" }), _jsx("pre", { className: "text-xs bg-gray-100 text-black p-2 rounded", children: JSON.stringify(timeline, null, 2) })] }));
            case "tasks":
                return (_jsxs("div", { children: [_jsx("p", { className: "text-base font-medium mb-2", children: "\uD83D\uDCCB Tasks" }), _jsx("pre", { className: "text-xs bg-gray-100 text-black p-2 rounded", children: JSON.stringify(tasks, null, 2) })] }));
            case "reports":
                return (_jsxs("div", { children: [_jsx("p", { className: "text-base font-medium mb-2", children: "\uD83D\uDCD1 Reports" }), _jsx("pre", { className: "text-xs bg-gray-100 text-black p-2 rounded", children: JSON.stringify(reports, null, 2) })] }));
            default:
                return null;
        }
    };
    if (isLoading && paramsCaseNumber) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-[#0f3d4d] to-[#2d2a80] text-white p-6", children: "Loading..." }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-[#0f3d4d] to-[#2d2a80] text-white px-6 py-6 text-sm", children: [_jsx("h1", { className: "text-2xl font-semibold mb-1", children: title }), _jsxs("p", { className: "text-md text-gray-300 mb-3", children: ["Case #", case_number ?? "—"] }), _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("span", { className: "bg-red-600 text-white px-3 py-1 rounded-full text-xs", children: priority }), _jsx("span", { className: "bg-cyan-600 text-white px-3 py-1 rounded-full text-xs", children: status })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: handleEditCase, className: "bg-cyan-100 text-black border border-cyan-300 px-4 py-1.5 rounded hover:bg-cyan-200", children: "\u270F\uFE0F Edit Case" }), _jsx("button", { onClick: handleGenerateReport, className: "bg-cyan-100 text-black border border-cyan-300 px-4 py-1.5 rounded hover:bg-cyan-200", children: "\uD83D\uDCC4 Generate Report" }), _jsx("button", { onClick: handleMoreActions, className: "bg-cyan-100 text-black border border-cyan-300 px-4 py-1.5 rounded hover:bg-cyan-200", children: "\u22EE Actions" }), _jsx("button", { onClick: handleCommunicate, className: "bg-cyan-100 text-black border border-cyan-300 px-4 py-1.5 rounded hover:bg-cyan-200", children: "\uD83D\uDCAC Communicate" }), _jsx("button", { onClick: handleIsolateResources, className: "bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700", children: "\uD83D\uDD12 Isolate All Compromised Resources" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "bg-white text-black p-4 rounded-xl border", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Assigned To" }), _jsxs("p", { className: "font-medium", children: ["\uD83D\uDC64 ", assigned_to] })] }), _jsxs("div", { className: "bg-white text-black p-4 rounded-xl border", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Created Date" }), _jsxs("p", { className: "font-medium", children: ["\uD83D\uDCC5 ", formatDate(created_at)] })] }), _jsxs("div", { className: "bg-white text-black p-4 rounded-xl border", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Last Updated" }), _jsxs("p", { className: "font-medium", children: ["\u23F1\uFE0F ", formatDate(updated_at)] })] })] }), _jsx("div", { className: "flex flex-wrap gap-3 mb-4", children: tabs.map((tab) => (_jsx("button", { onClick: () => handleTabChange(tab.key), className: `px-4 py-1.5 rounded-full text-sm font-medium ${activeTab === tab.key
                        ? "bg-purple-700 text-white shadow"
                        : "bg-cyan-100 text-black"}`, children: tab.label }, tab.key))) }), _jsx("div", { className: "bg-cyan-100 text-black p-4 rounded-xl mb-8", children: renderTabContent() }), resourceData && (_jsx(AddResourceModal, { isOpen: isAddModalOpen, onClose: () => {
                    setIsAddModalOpen(false);
                }, resourceData: resourceData, users: resourceData.Users, onSubmit: handleAddResourceSubmit })), _jsx(MalwareAnalysisDialog, { open: isMalwareDialogOpen, onClose: () => setIsMalwareDialogOpen(false), onStart: handleStartMalwareAnalysis, resourceName: malwareDialogCaseNumber ?? undefined }), _jsx(MalwareAnalysisTerminalBox, { open: malwareTerminalOpen, onClose: () => setMalwareTerminalOpen(false), caseNumber: malwareDialogCaseNumber ?? "" }), _jsx(EditResourceModal, { isOpen: isEditModalOpen, onClose: () => setIsEditModalOpen(false), caseData: caseDetails, users: resourceData?.Users || [], onSubmit: async (payload) => {
                    try {
                        // Add case_number to payload for update
                        const updatePayload = { ...payload, case_number };
                        await apiClient.post("/investigations/cases/update", updatePayload);
                        setIsEditModalOpen(false);
                        await queryClient.invalidateQueries({
                            queryKey: ["investigation", case_number],
                        });
                    }
                    catch (err) {
                        console.error("❌ Failed to update case:", err);
                    }
                } }), successMessage && (_jsxs("div", { className: "fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50", children: [successMessage, _jsx("button", { className: "ml-2 text-white font-bold", onClick: () => setSuccessMessage(null), children: "\u00D7" })] }))] }));
};
// Helper to robustly match all de-isolation success message variants
function isDeisolateSuccess(msg) {
    if (!msg)
        return false;
    const normalized = msg.toLowerCase().replace(/[-\s:]/g, "");
    return (normalized.includes("deisolatesuccess") ||
        normalized.includes("deisolatedsuccessfully") ||
        normalized.includes("deisolatedsuccess"));
}
export default NewInvestigationsPage;
