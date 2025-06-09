import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
export default function SidebarItem({ icon, label, to }) {
    return (_jsxs(NavLink, { to: to, className: ({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition font-medium ${isActive
            ? "bg-white/20 text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white"}`, children: [_jsx("div", { className: "w-5 h-5", children: icon }), _jsx("span", { className: "truncate", children: label })] }));
}
