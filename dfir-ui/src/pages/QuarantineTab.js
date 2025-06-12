import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
import { useState } from "react";
export default function QuarantineTab() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => fetcher("dashboard"),
    });
    const [accountIdFilter, setAccountIdFilter] = useState("");
    const [instanceIdFilter, setInstanceIdFilter] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    if (isLoading)
        return _jsx("p", { children: "Loading..." });
    if (error)
        return _jsx("p", { children: "Error loading quarantine data" });
    if (!data || data.length === 0)
        return _jsx("p", { children: "No quarantine data found." });
    const filteredData = data.filter((log) => {
        return ((accountIdFilter === "" || log.account_id === accountIdFilter) &&
            (instanceIdFilter === "" || log.instance_id === instanceIdFilter) &&
            (actionFilter === "" || log.action === actionFilter));
    });
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("select", { className: "border p-2 rounded", value: accountIdFilter, onChange: (e) => setAccountIdFilter(e.target.value), children: [_jsx("option", { value: "", children: "All Account IDs" }), [...new Set(data.map((d) => d.account_id))].map((id) => (_jsx("option", { value: id, children: id }, id)))] }), _jsxs("select", { className: "border p-2 rounded", value: instanceIdFilter, onChange: (e) => setInstanceIdFilter(e.target.value), children: [_jsx("option", { value: "", children: "All Instance IDs" }), [...new Set(data.map((d) => d.instance_id))].map((id) => (_jsx("option", { value: id, children: id }, id)))] }), _jsxs("select", { className: "border p-2 rounded", value: actionFilter, onChange: (e) => setActionFilter(e.target.value), children: [_jsx("option", { value: "", children: "All Actions" }), [...new Set(data.map((d) => d.action))].map((action) => (_jsx("option", { value: action, children: action }, action)))] })] }), _jsxs("table", { className: "min-w-full border border-gray-300 text-sm text-left", children: [_jsx("thead", { className: "bg-gray-100 text-gray-700 font-semibold text-base", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3 border", children: "Account ID" }), _jsx("th", { className: "p-3 border", children: "Instance ID" }), _jsx("th", { className: "p-3 border", children: "VPC ID" }), _jsx("th", { className: "p-3 border", children: "Action" }), _jsx("th", { className: "p-3 border", children: "Status" }), _jsx("th", { className: "p-3 border", children: "Message" }), _jsx("th", { className: "p-3 border", children: "Performed At" })] }) }), _jsx("tbody", { children: filteredData.map((log) => (_jsxs("tr", { className: "hover:bg-blue-50 text-gray-800", children: [_jsx("td", { className: "p-3 border", children: log.account_id }), _jsx("td", { className: "p-3 border", children: log.instance_id }), _jsx("td", { className: "p-3 border", children: log.vpc_id }), _jsx("td", { className: "p-3 border", children: log.action }), _jsx("td", { className: `p-3 border ${log.status === "success" ? "text-green-600" : "text-red-600"}`, children: log.status }), _jsx("td", { className: "p-3 border", children: log.message }), _jsx("td", { className: "p-3 border", children: new Date(log.performed_at).toLocaleString() })] }, log.id))) })] })] }));
}
