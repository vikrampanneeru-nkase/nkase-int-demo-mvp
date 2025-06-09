import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Tools.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
export default function Tools() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["tools"],
        queryFn: () => fetcher("tools"),
    });
    if (isLoading)
        return _jsx("p", { children: "Loading tools..." });
    if (error)
        return _jsx("p", { children: "Error loading tools" });
    return (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Tools" }), _jsx("pre", { children: JSON.stringify(data, null, 2) })] }));
}
