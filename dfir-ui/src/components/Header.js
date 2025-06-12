import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Bell, User } from "lucide-react";
const Header = () => {
    return (_jsxs("header", { className: "flex items-center justify-between px-6 py-3 bg-gradient-to-r from-cyan-700 to-purple-900 text-white shadow-md", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Home" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "relative", children: _jsx("input", { className: "rounded-lg px-3 py-1 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500", type: "text", placeholder: "Search..." }) }), _jsxs("div", { className: "relative", children: [_jsx(Bell, { className: "w-5 h-5 cursor-pointer hover:text-cyan-300 transition" }), _jsx("span", { className: "absolute -top-2 -right-2 text-[10px] bg-red-600 text-white rounded-full px-1.5 py-0.5 leading-none", children: "3" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-6 h-6" }), _jsx("span", { className: "text-sm font-medium", children: "NKASE_DEMO_TARGET" })] })] })] }));
};
export default Header;
