import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/CloudInventory.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
export default function CloudInventory() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["inventory"],
        queryFn: () => fetcher("inventory"),
    });
    if (isLoading)
        return _jsx("p", { children: "Loading inventory..." });
    if (error)
        return _jsx("p", { children: "Error loading inventory" });
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Cloud Inventory" }), _jsx("pre", { children: JSON.stringify(data, null, 2) })] }));
}
