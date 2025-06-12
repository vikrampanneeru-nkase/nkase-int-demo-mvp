import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Settings.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
export default function Settings() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["settings"],
        queryFn: () => fetcher("settings"),
    });
    if (isLoading)
        return _jsx("p", { children: "Loading settings..." });
    if (error)
        return _jsx("p", { children: "Error loading settings" });
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Settings" }), _jsx("pre", { children: JSON.stringify(data, null, 2) })] }));
}
