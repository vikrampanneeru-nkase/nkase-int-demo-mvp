import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ResourceCard.tsx
import { useState, useRef, useEffect } from "react";
export const ResourceCard = ({ title, instanceId, resourceType, status, awsRegion, }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (_jsxs("div", { className: "relative flex justify-between items-center border border-cyan-400 bg-cyan-100 p-4 rounded-md shadow-sm", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [_jsx("span", { children: "\uD83D\uDDA5\uFE0F" }), title, _jsx("span", { className: "text-sm bg-gray-200 px-2 py-0.5 rounded-full ml-2 text-gray-700 border", children: "Not Contained" })] }), _jsxs("p", { className: "text-sm text-gray-700 mt-1", children: ["AWS Region: ", awsRegion ?? "N/A", " \u00A0\u2022\u00A0 Type: ", resourceType, " \u00A0\u2022\u00A0", _jsxs("span", { className: "text-green-600", children: ["Status: ", status] }), _jsx("span", { className: "inline-block ml-4 text-xs text-white bg-red-500 px-2 py-0.5 rounded-full", children: "\u26A0\uFE0F Compromised" })] }), _jsx("p", { className: "text-sm mt-1", children: "IP: 10.0.1.15" })] }), _jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsx("button", { onClick: () => setDropdownOpen((prev) => !prev), className: "bg-cyan-400 hover:bg-cyan-500 text-black font-medium py-2 px-4 rounded-md", children: "Actions \u00A0\u22EF" }), dropdownOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10 border", children: [_jsx("button", { className: "w-full text-left px-4 py-2 hover:bg-cyan-100", children: "\uD83D\uDCDC View Activity" }), _jsx("button", { className: "w-full text-left px-4 py-2 hover:bg-cyan-100", children: "\u274E Unmark Compromised" }), _jsx("button", { className: "w-full text-left px-4 py-2 hover:bg-cyan-100", children: "\uD83D\uDD13 Release Containment" })] }))] })] }));
};
