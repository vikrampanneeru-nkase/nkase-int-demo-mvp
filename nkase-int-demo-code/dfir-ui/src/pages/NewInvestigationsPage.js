import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetcher } from "../api/fetcher";
import apiClient from "@/api/client";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const stateColors = {
    running: "bg-green-100 text-green-800",
    stopped: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    terminated: "bg-gray-200 text-gray-600",
};
export default function NewInvestigationsPage() {
    const [actionMessage, setActionMessage] = useState(null);
    const [actionResults, setActionResults] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const navigate = useNavigate();
    const { data = [], isLoading, error, refetch, } = useQuery({
        queryKey: ["investigations_new"],
        queryFn: async () => {
            const raw = await fetcher("investigations/new");
            return raw.map((item) => {
                const nameTag = item.Tags?.find((tag) => tag.Key === "Name");
                return {
                    id: item.InstanceId,
                    name: nameTag?.Value || "Unnamed",
                    instance_type: item.InstanceType,
                    state: item.State?.toLowerCase() ?? "unknown",
                    availability_zone: item.AvailabilityZone,
                    private_ip: item.PrivateIpAddress,
                    public_ip: item.PublicIpAddress || null,
                    volume_ids: item.VolumeIds || [],
                    is_quarantined: item.is_quarantined ?? false,
                };
            });
        },
    });
    const handleAction = async (instanceId, action) => {
        setLoadingId(instanceId);
        setActionMessage(null);
        setActionResults([]);
        try {
            const response = await apiClient.post(`/investigations/${action}`, {
                instance_ids: [instanceId],
            });
            const results = response.data;
            setActionResults(results);
            const match = results[0]?.match(/job id: ([a-f0-9\-]+)/i);
            const jobId = match?.[1];
            toast.success(`${action} action complete.`);
            await refetch();
        }
        catch (err) {
            const msg = `Error during ${action}: ${err.message}`;
            setActionMessage(msg);
            toast.error(msg);
        }
        finally {
            setLoadingId(null);
        }
    };
    return (_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Investigations" }), actionMessage && (_jsx("div", { className: "bg-red-100 text-red-800 px-4 py-2 rounded mb-4 border border-red-300", children: actionMessage })), actionResults.length > 0 && (_jsx("div", { className: "bg-green-100 text-green-800 px-4 py-2 rounded mb-4 border border-green-300", children: actionResults.map((line, i) => (_jsx("div", { children: line.replace("status : ", "") }, i))) })), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4", children: data.map((instance) => (_jsx(InstanceCard, { instance: instance, loading: loadingId === instance.id, onAction: handleAction }, instance.id))) })] }));
}
function InstanceCard({ instance, loading, onAction, }) {
    const stateClass = stateColors[instance.state] || "bg-gray-100 text-gray-700";
    const options = instance.is_quarantined
        ? ["Un-Quarantine", "Mitigate"]
        : ["Quarantine", "Mitigate"];
    return (_jsxs("div", { className: "bg-white rounded-xl shadow p-5 border flex flex-col gap-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { className: "text-lg font-semibold", children: instance.name }), _jsx("span", { className: `text-xs px-2 py-1 rounded-full font-medium ${stateClass}`, children: instance.state })] }), _jsxs("div", { className: "text-sm text-gray-700 space-y-1", children: [_jsxs("div", { children: [_jsx("strong", { children: "ID:" }), " ", instance.id] }), _jsxs("div", { children: [_jsx("strong", { children: "Type:" }), " ", instance.instance_type] }), _jsxs("div", { children: [_jsx("strong", { children: "AZ:" }), " ", instance.availability_zone] }), _jsxs("div", { children: [_jsx("strong", { children: "Private IP:" }), " ", instance.private_ip] }), _jsxs("div", { children: [_jsx("strong", { children: "Public IP:" }), " ", instance.public_ip || "N/A"] }), _jsxs("div", { children: [_jsx("strong", { children: "Volumes:" }), _jsx("ul", { className: "list-disc list-inside", children: instance.volume_ids.map((vol, idx) => (_jsx("li", { children: vol }, idx))) })] }), _jsxs("div", { children: [_jsx("strong", { children: "Quarantine:" }), " ", _jsx("span", { className: instance.is_quarantined ? "text-red-600" : "text-green-600", children: instance.is_quarantined ? "Yes" : "No" })] })] }), _jsxs("div", { className: "mt-4", children: [_jsxs("select", { className: "w-full border px-3 py-2 rounded", onChange: (e) => e.target.value &&
                            onAction(instance.id, e.target.value), disabled: loading, defaultValue: "", children: [_jsx("option", { value: "", disabled: true, children: "Select Action" }), options.map((opt) => (_jsx("option", { value: opt, children: opt }, opt)))] }), loading && (_jsxs("div", { className: "mt-2 flex items-center gap-2 text-sm text-blue-600", children: [_jsx(FaSpinner, { className: "animate-spin" }), " Processing..."] }))] })] }));
}
