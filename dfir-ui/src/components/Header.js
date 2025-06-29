import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Bell, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetcher } from "@/api/fetcher";
export default function Header() {
    const [showTooltip, setShowTooltip] = useState(false);
    const { data = { in_progress_count: 0, case_numbers: [] }, isLoading, error, } = useQuery({
        queryKey: ["in-progress-data"],
        queryFn: async () => await fetcher("dashboard/mitigations/in-progress/count"),
        refetchInterval: 120000,
    });
    return (_jsx(_Fragment, { children: _jsxs("header", { className: "flex items-center justify-between px-6 py-3 bg-gradient-to-r from-cyan-700 to-purple-900 text-white shadow-md", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Home" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("input", { className: "rounded-lg px-3 py-1 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500", type: "text", placeholder: "Search..." }), _jsxs("div", { className: "relative group", onMouseEnter: () => setShowTooltip(true), onMouseLeave: () => setShowTooltip(false), children: [_jsxs("div", { className: "cursor-default", children: [_jsx(Bell, { className: "w-5 h-5 hover:text-cyan-300 transition" }), data.in_progress_count > 0 && (_jsx("span", { className: "absolute -top-2 -right-2 text-[10px] bg-red-600 text-white rounded-full px-1.5 py-0.5 leading-none", children: data.in_progress_count }))] }), showTooltip && data.case_numbers.length > 0 && (_jsxs("div", { className: "absolute top-6 right-0 bg-white text-black shadow-lg rounded-md text-xs z-50 p-2 w-60", children: [_jsx("p", { className: "font-semibold mb-2 text-gray-700", children: "In-Progress Job IDs:" }), _jsx("ul", { className: "space-y-1 max-h-40 overflow-y-auto", children: data.case_numbers.map((id) => (_jsx("li", { className: "break-all", children: id }, id))) })] }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-6 h-6" }), _jsx("span", { className: "text-sm font-medium", children: "NKASE_DEMO_TARGET" })] })] })] }) }));
}
