import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Reports.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
import { useState } from "react";
export default function Reports() {
    const [caseNumber, setCaseNumber] = useState("");
    const { data, isLoading, error } = useQuery({
        queryKey: ["action_job_details", caseNumber],
        queryFn: () => caseNumber ? fetcher(`investigations/nkase/logs?case_number=${caseNumber}`) : Promise.resolve([]),
        enabled: !!caseNumber,
    });
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Action Job Details by Case Number" }), _jsx("input", { className: "border px-2 py-1 mb-4", placeholder: "Enter Case Number...", value: caseNumber, onChange: e => setCaseNumber(e.target.value) }), isLoading && _jsx("p", { children: "Loading action job details..." }), error && _jsx("p", { children: "Error loading action job details" }), data && data.length > 0 ? (_jsx("pre", { children: JSON.stringify(data, null, 2) })) : (!isLoading && _jsx("p", { children: "No data found for this case number." }))] }));
}
