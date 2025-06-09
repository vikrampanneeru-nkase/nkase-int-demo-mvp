import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
const stageColor = {
    completed: "text-green-600",
    failed: "text-red-600",
    started: "text-yellow-600",
};
const getStageProgress = (stage) => {
    const stages = ["started", "snapshot", "volume", "detach", "completed"];
    const index = stages.indexOf(stage);
    return Math.max(0, ((index + 1) / stages.length) * 100);
};
export default function MitigationTab() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["mitigation"],
        queryFn: () => fetcher("dashboard/mitigated"),
    });
    const handleJobClick = async (jobId) => {
        try {
            const jobDetail = await fetcher(`investigations/mitigation/status/${jobId}`);
            console.log("Job details:", jobDetail);
            alert(`Fetched job ${jobId}:\n${JSON.stringify(jobDetail, null, 2)}`);
        }
        catch (err) {
            console.error("Failed to fetch job details", err);
            alert("Failed to fetch job details");
        }
    };
    if (isLoading)
        return _jsx("p", { className: "text-gray-700", children: "Loading mitigation data..." });
    if (error)
        return _jsx("p", { className: "text-red-600", children: "Error loading mitigation data" });
    if (!data || data.length === 0)
        return _jsx("p", { children: "No mitigation jobs found." });
    return (_jsx("div", { className: "space-y-6 font-sans p-4 max-w-5xl mx-auto", children: data.map((job) => (_jsxs("div", { className: "p-6 bg-white rounded-xl shadow-md border border-gray-200", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-sm text-gray-500", children: ["Job ID:", " ", _jsx("button", { onClick: () => handleJobClick(job.job_id), className: "text-blue-600 hover:underline", children: job.job_id })] }), _jsxs("p", { className: "text-lg font-semibold text-gray-800", children: ["Instance ID: ", job.instance_id] }), _jsxs("p", { className: `text-md mt-1 ${stageColor[job.stage] || "text-gray-600"}`, children: ["Stage: ", job.stage] }), job.error_message && (_jsxs("p", { className: "text-red-500 text-sm mt-1", children: ["Error: ", job.error_message] }))] }), _jsx("div", { className: "w-1/3", children: _jsx("div", { className: "h-2 rounded bg-gray-200", children: _jsx("div", { className: "h-2 rounded bg-blue-500", style: { width: `${getStageProgress(job.stage)}%` } }) }) })] }), _jsxs("div", { className: "text-sm text-gray-500 space-y-1", children: [_jsxs("p", { children: ["Started: ", new Date(job.created_at).toLocaleString()] }), _jsxs("p", { children: ["Updated: ", new Date(job.updated_at).toLocaleString()] })] })] }, job.job_id))) }));
}
