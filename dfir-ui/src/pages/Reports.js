import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Reports.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
export default function Reports() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["reports"],
        queryFn: () => fetcher("reports"),
    });
    if (isLoading)
        return _jsx("p", { children: "Loading reports..." });
    if (error)
        return _jsx("p", { children: "Error loading reports" });
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Reports" }), _jsx("pre", { children: JSON.stringify(data, null, 2) })] }));
}
