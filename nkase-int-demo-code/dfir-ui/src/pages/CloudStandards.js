import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/CloudStandards.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
export default function CloudStandards() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["standards"],
        queryFn: () => fetcher("standards"),
    });
    if (isLoading)
        return _jsx("p", { children: "Loading standards..." });
    if (error)
        return _jsx("p", { children: "Error loading standards" });
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Cloud Standards" }), _jsx("pre", { children: JSON.stringify(data, null, 2) })] }));
}
