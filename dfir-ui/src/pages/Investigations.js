import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetcher } from "../api/fetcher";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
const priorityColor = {
    Critical: "bg-red-500 text-white",
    High: "bg-green-400 text-white",
    Medium: "bg-teal-300 text-white",
    Low: "bg-yellow-400 text-white",
};
const statusColor = {
    Open: "bg-teal-200 text-black",
    "In Progress": "bg-teal-400 text-white",
    Closed: "bg-gray-300 text-black",
    Archived: "bg-purple-300 text-white",
};
const tabs = ["Open", "In Progress", "Closed", "Archived"];
export default function Investigations() {
    const [filter, setFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { data, isLoading, error } = useQuery({
        queryKey: ["investigations"],
        queryFn: () => fetcher("investigations"),
    });
    const investigations = data || [];
    const filteredData = investigations.filter((item) => {
        const matchesStatus = filter === "All" || item.status === filter;
        const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;
        const searchLower = search.toLowerCase();
        const matchesSearch = item.title.toLowerCase().includes(searchLower) ||
            item.case_number.toLowerCase().includes(searchLower);
        return matchesStatus && matchesPriority && matchesSearch;
    });
    const getLatestCaseNumber = () => {
        if (investigations.length === 0)
            return "";
        const sorted = [...investigations].sort((a, b) => b.case_number.localeCompare(a.case_number));
        return sorted[0].case_number;
    };
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Investigations" }), _jsx("p", { className: "text-sm text-gray-500", children: "Manage and track all digital forensic investigations" })] }), _jsx("div", { className: "flex justify-end mb-4", children: _jsxs("button", { onClick: () => {
                        const latest = getLatestCaseNumber();
                        navigate(`/newinvestigations/${latest}`);
                    }, className: "bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "New Investigation" })] }) }), _jsxs("div", { className: "bg-cyan-50 rounded-xl p-4 shadow space-y-4", children: [_jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { onClick: () => setFilter("All"), className: `px-4 py-2 rounded-full text-sm font-medium ${filter === "All"
                                    ? "bg-purple-700 text-white"
                                    : "bg-white text-gray-800 border border-gray-300"}`, children: "All Investigations" }), tabs.map((tab) => (_jsx("button", { onClick: () => setFilter(tab), className: `px-4 py-2 rounded-full text-sm font-medium ${filter === tab
                                    ? "bg-purple-700 text-white"
                                    : "bg-white text-gray-800 border border-gray-300"}`, children: tab }, tab)))] }), _jsxs("div", { className: "flex justify-between items-center gap-4", children: [_jsx("input", { type: "text", placeholder: "\uD83D\uDD0D Search investigations...", className: "px-4 py-2 border border-gray-300 rounded-lg flex-1 max-w-md", value: search, onChange: (e) => setSearch(e.target.value) }), _jsxs("select", { value: priorityFilter, onChange: (e) => setPriorityFilter(e.target.value), className: "px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700", children: [_jsx("option", { value: "All", children: "All Priorities" }), _jsx("option", { value: "Critical", children: "Critical" }), _jsx("option", { value: "High", children: "High" }), _jsx("option", { value: "Medium", children: "Medium" }), _jsx("option", { value: "Low", children: "Low" })] })] }), isLoading ? (_jsx("div", { className: "text-gray-500", children: "Loading investigations..." })) : error ? (_jsx("div", { className: "text-red-600", children: "Error loading data" })) : filteredData.length === 0 ? (_jsx("div", { className: "text-gray-500", children: "No investigations found" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full text-sm text-left", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-gray-600 border-b", children: [_jsx("th", { className: "py-2 px-3", children: "Case Number" }), _jsx("th", { className: "py-2 px-3", children: "Title" }), _jsx("th", { className: "py-2 px-3", children: "Priority" }), _jsx("th", { className: "py-2 px-3", children: "Status" }), _jsx("th", { className: "py-2 px-3", children: "Assigned To" }), _jsx("th", { className: "py-2 px-2", children: "Created" }), _jsx("th", { className: "py-2 px-3", children: "Last Updated" })] }) }), _jsx("tbody", { children: filteredData.map((item, index) => (_jsxs("tr", { onClick: () => navigate(`/newinvestigations/${item.case_number}`), className: `border-b cursor-pointer hover:bg-cyan-100 ${item.priority === "Critical" ? "bg-red-50" : "bg-white"}`, children: [_jsx("td", { className: "py-2 px-3 font-medium text-gray-800", children: item.case_number }), _jsx("td", { className: "py-2 px-3 text-blue-800 underline", children: item.title }), _jsx("td", { className: "py-2 px-3", children: _jsx("span", { className: `px-3 py-1 text-xs rounded-full font-semibold ${priorityColor[item.priority]}`, children: item.priority }) }), _jsx("td", { className: "py-2 px-3", children: _jsx("span", { className: `px-3 py-1 text-xs rounded-full font-semibold ${statusColor[item.status]}`, children: item.status }) }), _jsx("td", { className: "py-2 px-3 font-medium text-gray-800", children: item.assigned_to }), _jsx("td", { className: "py-2 px-2 font-medium text-gray-800", children: new Date(item.created_at).toLocaleString() }), _jsx("td", { className: "py-2 px-3 font-medium text-gray-800", children: new Date(item.updated_at).toLocaleString() })] }, index))) })] }) }))] })] }));
}
