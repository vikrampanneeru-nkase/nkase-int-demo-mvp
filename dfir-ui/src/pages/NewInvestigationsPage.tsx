import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AddResourceModal from "../components/AddResourceModal";
import MalwareAnalysisDialog from "../components/MalwareAnalysisDialog";
import MalwareAnalysisTerminalBox from "../components/MalwareAnalysisTerminalBox";
import EditResourceModal from "../components/EditResourceModal";
import { fetcher } from "../api/fetcher";
import apiClient from "@/api/client";
import { ResourcesResponse, User } from "@/types";

import {
  Clock,
  UserCog,
  StickyNote,
  ShieldAlert,
  AlertTriangle,
  FolderOpen,
  Copy,
  FileClock,
  ShieldCheck,
  Trash2,
  Shield,
  Database,
  HardDrive,
  ShieldOff,
} from "lucide-react";

const tabs = [
  { label: "Overview", key: "overview" },
  { label: "Resources Under Investigation", key: "resources" },
  { label: "Evidence", key: "evidence" },
  { label: "Timeline", key: "timeline" },
  { label: "Investigation Tasks", key: "tasks" },
  { label: "Reports", key: "reports" },
];

const formatDate = (dateStr: string | null) => {
  if (!dateStr || dateStr === "N/A") return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fetchCaseDetails = async (case_number: string) => {
  return await fetcher(`investigations/${case_number}`);
};

const fetchAllResourceTypes = async () => {
  return await fetcher("investigations/resources/available");
};

const fetchNonClosedCases = async () => {
  return await fetcher("investigations/cases/open");
};

const NewInvestigationsPage = () => {
  const { case_number: paramsCaseNumber } = useParams<{
    case_number?: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resourceData, setResourceData] = useState<ResourcesResponse | null>(
    null
  );
  const [nonClosedCasesEnabled, setNonClosedCasesEnabled] = useState(false);
  const [isMalwareDialogOpen, setIsMalwareDialogOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);
  const [malwareTerminalOpen, setMalwareTerminalOpen] = useState(false);
  const [malwareDialogCaseNumber, setMalwareDialogCaseNumber] = useState<
    string | null
  >(null);
  const [openDropdownCase, setOpenDropdownCase] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    actionType?: string;
    caseNumber?: string;
  }>({ open: false });
  const [processingInstanceIds, setProcessingInstanceIds] = useState<string[]>(
    []
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["investigation", paramsCaseNumber],
    queryFn: () => fetchCaseDetails(paramsCaseNumber!),
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
  const {
    case_number,
    title,
    description,
    priority,
    status,
    assigned_to,
    created_at,
    updated_at,
    due_date,
    instance_id,
    accountId,
    accountName,
    resource_type,
    cloud,
  } = caseDetails;

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

  const MenuItem = ({ icon, label, danger = false, onClick }: any) => (
    <div
      className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-[#caf2f4] ${
        danger ? "text-red-600" : "text-gray-800"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  );

  const SubMenu = ({
    icon,
    label,
    children,
  }: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
      setIsOpen((prev) => !prev);
    };

    return (
      <div className="relative">
        <div
          className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-800"
          onClick={toggleMenu}
        >
          {icon}
          <span className="ml-2">{label}</span>
        </div>

        {isOpen && (
          <div className="absolute left-full top-0 mt-0 ml-1 w-64 bg-white border rounded-lg shadow-xl z-50">
            {children}
          </div>
        )}
      </div>
    );
  };

  const ResourceDropdown = ({
    onClose,
    caseNumber,
    resource,
  }: {
    onClose: () => void;
    caseNumber: string;
    resource: any;
  }) => {
    const [showConfirm, setShowConfirm] = useState<
      false | "isolate" | "deisolate"
    >(false);
    const [localProcessing, setLocalProcessing] = useState(false);

    const handleAction = async (actionType: string) => {
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
      } catch (error) {
        console.error("❌ Action failed:", error);
      } finally {
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
        if (
          Array.isArray(result) &&
          result[0]?.startsWith("Isolate success:")
        ) {
          setSuccessMessage(
            `Instance ${
              resource.instance_id || resource.instanceId
            } Quarantine successfully.`
          );
        }
        await queryClient.invalidateQueries({ queryKey: ["nonClosedCases"] });
        onClose?.(); // <-- Ensure dropdown closes after action
      } catch (error) {
        console.error("❌ Isolation failed:", error);
      } finally {
        setLocalProcessing(false);
        setProcessingInstanceIds((prev) =>
          prev.filter(
            (id) => id !== (resource.instance_id || resource.instanceId)
          )
        );
      }
    };

    // Only show the dropdown if no confirmation dialog is open
    if (showConfirm === "isolate") {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Confirm Isolation
            </h2>
            <p className="mb-4 text-gray-700">
              Do you want to isolate this instance?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1.5 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
              <button
                className="px-4 py-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleConfirmIsolate}
              >
                {localProcessing ? "Processing..." : "Yes, Isolate"}
              </button>
            </div>
          </div>
        </div>
      );
    }
    if (showConfirm === "deisolate") {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px]">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Confirm De-isolation
            </h2>
            <p className="mb-4 text-gray-700">
              Do you want to de-isolate this instance?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1.5 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
              <button
                className="px-4 py-1.5 rounded bg-cyan-600 text-white hover:bg-cyan-700"
                onClick={async () => {
                  setShowConfirm(false);
                  setLocalProcessing(true);
                  setProcessingInstanceIds((prev) => [
                    ...prev,
                    resource.instance_id || resource.instanceId,
                  ]);
                  try {
                    const resp = await apiClient.post(
                      "/investigations/un-Quarantine",
                      {
                        case_number: caseNumber,
                        action: "deisolate",
                        instance_id:
                          resource.instance_id ||
                          resource.instanceId ||
                          undefined,
                      }
                    );
                    const result = resp.data;
                    let foundSuccess = false;
                    if (Array.isArray(result)) {
                      foundSuccess = result.some((msg) =>
                        isDeisolateSuccess(msg)
                      );
                    } else if (typeof result === "string") {
                      foundSuccess = isDeisolateSuccess(result);
                    }
                    if (foundSuccess) {
                      setSuccessMessage(
                        `Instance ${
                          resource.instance_id || resource.instanceId
                        } Dequarantine successfully.`
                      );
                    }
                    await queryClient.invalidateQueries({
                      queryKey: ["nonClosedCases"],
                    });
                    onClose?.();
                  } catch (error) {
                    console.error("❌ De-isolation failed:", error);
                  } finally {
                    setLocalProcessing(false);
                    setProcessingInstanceIds((prev) =>
                      prev.filter(
                        (id) => id !== (resource.instance_id || resource.instanceId)
                      )
                    );
                  }
                }}
              >
                {localProcessing ? "Processing..." : "Yes, De-isolate"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="absolute right-0 z-50 mt-2 w-64 bg-[#e0f9fb] border rounded-xl shadow-xl p-2">
        <p className="px-3 py-1 text-sm font-semibold text-gray-700">
          Resource Actions
        </p>

        <SubMenu icon={<ShieldAlert size={16} />} label="Forensic Analysis">
          <MenuItem
            icon={<Shield size={16} />}
            label="Malware Analysis"
            onClick={() => handleAction("malware_analysis")}
          />
        </SubMenu>
        {/* Only show Isolate if not already quarantined */}
        {resource.isquarantine !== "Y" && (
          <MenuItem
            icon={<Shield size={16} />}
            label="Quarantine"
            onClick={() => handleAction("isolate")}
          />
        )}
        {/* Deisolate always shown, but you can also disable if not quarantined */}
        {resource.isquarantine !== "N" && (
          <MenuItem
            icon={<ShieldOff size={16} />}
            label="Dequarantine"
            onClick={() => handleAction("deisolate")}
            disabled={resource.isquarantine !== "Y"}
          />
        )}
        <div className="border-t border-gray-200 my-1" />

        <MenuItem
          icon={<Trash2 size={16} className="text-red-500" />}
          label="Destroy Resource"
          danger
          onClick={() => handleAction("destroy_resource")}
        />
      </div>
    );
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "resources") {
      setNonClosedCasesEnabled(false); // Always refetch on tab click
      setTimeout(() => setNonClosedCasesEnabled(true), 0); // Force re-trigger fetch
    } else {
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
    } catch (error) {
      console.error("❌ Isolation failed", error);
      alert("❌ Failed to isolate resources.");
    }
  };

  const handleAddResourceSubmit = async (payload: any) => {
    try {
      const response = await apiClient.post(
        "/investigations/cases/create",
        payload
      );
      const data = response.data as { case_number: string };
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
    } catch (err) {
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
    } catch (error) {
      setMalwareTerminalOpen(false);
      console.error("❌ Malware analysis failed:", error);
    }
  };
  const InvestigationCard = ({ inv }: { inv: any }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
      <div className="relative bg-white p-4 rounded-xl border shadow hover:bg-gray-50 min-w-[300px]">
        <p className="font-semibold text-sm">🧩 {inv.title}</p>
        <p className="text-xs text-gray-600">Case #: {inv.case_number}</p>
        <p className="text-xs text-gray-600">Status: {inv.status}</p>
        <p className="text-xs text-gray-600">
          Assigned To: {inv.assigned_to || "Unassigned"}
        </p>
        <p className="text-xs text-gray-600">
          Updated: {formatDate(inv.updated_at)}
        </p>

        <div className="mt-2 relative flex justify-end">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-1 text-sm bg-[#caf2f4] font-medium text-gray-700 hover:bg-cyan-100"
          >
            Actions
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-10 w-40 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <ResourceDropdown
                onClose={() => setDropdownOpen(false)}
                caseNumber={inv.case_number}
                resource={inv}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
  // ResourceCard for each resource in Resources tab
  const ResourceCard = ({
    res,
    caseNumber,
  }: {
    res: any;
    caseNumber: string;
  }) => {
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    return (
      <div className="bg-white text-black p-6 rounded-xl border shadow relative flex flex-col gap-2 min-w-[320px]">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">
            {res.title || res.instanceId || res.instance_id || "Resource"}
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-1 text-sm bg-[#caf2f4] font-medium text-gray-700 hover:bg-cyan-100"
            >
              Actions
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 z-10 w-40 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <ResourceDropdown
                  onClose={() => setDropdownOpen(false)}
                  caseNumber={caseNumber}
                  resource={res}
                />
              </div>
            )}
          </div>
        </div>
        <div className="border rounded-lg bg-gray-50 p-4 grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="text-gray-600 font-semibold">Case #</div>
          <div className="font-mono">{res.case_number || "-"}</div>
          <div className="text-gray-600 font-semibold">Instance Id</div>
          <div className="font-mono">{res.instance_id || res.instanceId || "-"}</div>
          <div className="text-gray-600 font-semibold">Account Id</div>
          <div className="font-mono">{res.accountId || res.account_id || "-"}</div>
          <div className="text-gray-600 font-semibold">Assigned To</div>
          <div className="font-mono">{res.assigned_to || "-"}</div>
          <div className="text-gray-600 font-semibold">Type</div>
          <div>{res.resourceType || res.resource_type || "-"}</div>
          <div className="text-gray-600 font-semibold">Title</div>
          <div>{res.title || "-"}</div>
        </div>
        {/* In ResourceCard, show a spinner/processing bar if processingInstanceIds includes this instance */}
        {processingInstanceIds.includes(res.instance_id || res.instanceId) ? (
          <div className="flex items-center gap-2 mt-2">
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-700"></span>
            <span className="text-cyan-700 text-xs">
              {res.isquarantine === "Y" && res.isquarantine !== undefined
                ? "Quarantine in progress..."
                : res.isquarantine === "N" && res.isquarantine !== undefined
                ? "De-isolation in progress..."
                : "Isolation in progress..."}
            </span>
          </div>
        ) : res.isquarantine === "Y" ? (
          <div className="flex items-center gap-2 mt-2">
            <ShieldAlert className="text-red-600" size={16} />
            <span className="text-red-700 text-xs font-semibold">
              Instance Quarantined
            </span>
          </div>
        ) : null}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="bg-cyan-100 px-6 py-4 rounded-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Case Description
            </h2>
            <p className="text-sm text-gray-800">
              {description || "No description available."}
            </p>
          </div>
        );

      case "resources":
        const resourceList =
          Array.isArray(nonClosedCases) && nonClosedCases.length > 0
            ? nonClosedCases
            : Array.isArray(resources)
            ? resources
            : [];
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg text-gray-500 mb-0">
                {resourceList.length === 0
                  ? "No resources linked yet."
                  : "Resources Under Investigation"}
              </p>
              <button
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-cyan-700 transition"
                onClick={handleAddResource}
              >
                ➕ Add Resource
              </button>
            </div>
            <hr className="my-6 border-gray-300" />
            {resourceList.length > 0 ? (
              <div className="flex flex-col gap-6">
                {resourceList.map((res: any, idx: number) => (
                  <ResourceCard key={res.case_number || res.instanceId || res.instance_id || idx} res={res} caseNumber={res.case_number} />
                ))}
              </div>
            ) : null}
          </div>
        );

      case "evidence":
        return (
          <div>
            <p className="text-base font-medium mb-2">🧾 Evidence / Findings</p>
            <pre className="text-xs bg-gray-100 text-black p-2 rounded">
              {JSON.stringify(findings, null, 2)}
            </pre>
          </div>
        );

      case "timeline":
        return (
          <div>
            <p className="text-base font-medium mb-2">📅 Timeline</p>
            <pre className="text-xs bg-gray-100 text-black p-2 rounded">
              {JSON.stringify(timeline, null, 2)}
            </pre>
          </div>
        );

      case "tasks":
        return (
          <div>
            <p className="text-base font-medium mb-2">📋 Tasks</p>
            <pre className="text-xs bg-gray-100 text-black p-2 rounded">
              {JSON.stringify(tasks, null, 2)}
            </pre>
          </div>
        );

      case "reports":
        return (
          <div>
            <p className="text-base font-medium mb-2">📑 Reports</p>
            <pre className="text-xs bg-gray-100 text-black p-2 rounded">
              {JSON.stringify(reports, null, 2)}
            </pre>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading && paramsCaseNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f3d4d] to-[#2d2a80] text-white p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f3d4d] to-[#2d2a80] text-white px-6 py-6 text-sm">
      <h1 className="text-2xl font-semibold mb-1">{title}</h1>
      <p className="text-md text-gray-300 mb-3">Case #{case_number ?? "—"}</p>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Priority and Status */}
        <div className="flex gap-2">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs">
            {priority}
          </span>
          <span className="bg-cyan-600 text-white px-3 py-1 rounded-full text-xs">
            {status}
          </span>
        </div>

        {/* Button Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleEditCase}
            className="bg-cyan-100 text-black border border-cyan-300 px-4 py-1.5 rounded hover:bg-cyan-200"
          >
            ✏️ Edit Case
          </button>
          <button
            onClick={handleGenerateReport}
            className="bg-cyan-100 text-black border border-cyan-300 px-4 py-1.5 rounded hover:bg-cyan-200"
          >
            📄 Generate Report
          </button>
          <button
            onClick={handleMoreActions}
            className="bg-cyan-100 text-black border border-cyan-300 px-4 py-1.5 rounded hover:bg-cyan-200"
          >
            ⋮ Actions
          </button>
          <button
            onClick={handleCommunicate}
            className="bg-cyan-100 text-black border border-cyan-300 px-4 py-1.5 rounded hover:bg-cyan-200"
          >
            💬 Communicate
          </button>
          <button
            onClick={handleIsolateResources}
            className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700"
          >
            🔒 Isolate All Compromised Resources
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white text-black p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Assigned To</p>
          <p className="font-medium">👤 {assigned_to}</p>
        </div>
        <div className="bg-white text-black p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Created Date</p>
          <p className="font-medium">📅 {formatDate(created_at)}</p>
        </div>
        <div className="bg-white text-black p-4 rounded-xl border">
          <p className="text-xs text-gray-500">Last Updated</p>
          <p className="font-medium">⏱️ {formatDate(updated_at)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              activeTab === tab.key
                ? "bg-purple-700 text-white shadow"
                : "bg-cyan-100 text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-cyan-100 text-black p-4 rounded-xl mb-8">
        {renderTabContent()}
      </div>

      {resourceData && (
        <AddResourceModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
          }}
          resourceData={resourceData}
          users={resourceData.Users as User[]}
          onSubmit={handleAddResourceSubmit}
        />
      )}
      <MalwareAnalysisDialog
        open={isMalwareDialogOpen}
        onClose={() => setIsMalwareDialogOpen(false)}
        onStart={handleStartMalwareAnalysis}
        resourceName={malwareDialogCaseNumber ?? undefined}
      />
      <MalwareAnalysisTerminalBox
        open={malwareTerminalOpen}
        onClose={() => setMalwareTerminalOpen(false)}
        caseNumber={malwareDialogCaseNumber ?? ""}
      />
      <EditResourceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        caseData={caseDetails}
        users={resourceData?.Users || []}
        onSubmit={async (payload) => {
          try {
            // Add case_number to payload for update
            const updatePayload = { ...payload, case_number };
            await apiClient.post("/investigations/cases/update", updatePayload);
            setIsEditModalOpen(false);
            await queryClient.invalidateQueries({
              queryKey: ["investigation", case_number],
            });
          } catch (err) {
            console.error("❌ Failed to update case:", err);
          }
        }}
      />

      {/* Show success message if set */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {successMessage}
          <button
            className="ml-2 text-white font-bold"
            onClick={() => setSuccessMessage(null)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

// Helper to robustly match all de-isolation success message variants
function isDeisolateSuccess(msg: string) {
  if (!msg) return false;
  const normalized = msg.toLowerCase().replace(/[-\s:]/g, "");
  return (
    normalized.includes("deisolatesuccess") ||
    normalized.includes("deisolatedsuccessfully") ||
    normalized.includes("deisolatedsuccess")
  );
}

export default NewInvestigationsPage;

