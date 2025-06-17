import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
export default function SidebarItem({ icon, label, to }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = location.pathname === to;
    return (_jsxs("div", { className: clsx("flex items-center gap-3 px-4 py-2 rounded-xl text-sm cursor-pointer transition", isActive
            ? "bg-sidebar-active text-white font-medium"
            : "text-white/80 hover:bg-sidebar-hover hover:text-white"), onClick: () => navigate(to), children: [_jsx("div", { className: "w-5 h-5", children: icon }), _jsx("span", { className: "truncate", children: label })] }));
}
