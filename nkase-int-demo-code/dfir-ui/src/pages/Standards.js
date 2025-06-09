import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../api/fetcher";
export default function Standards() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["standards"],
        queryFn: () => fetcher("standards"),
    });
    if (isLoading)
        return _jsx("div", { children: "Loading standards..." });
    if (error)
        return _jsx("div", { children: "Error loading standards" });
    return (_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Cloud Standards Enforcements" }), _jsx("ul", { className: "space-y-2", children: data.map((item, index) => (_jsx("li", { className: "bg-white p-3 rounded shadow", children: item.title || JSON.stringify(item) }, index))) })] }));
}
