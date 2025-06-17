import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { Search, BarChart2, Server, ShieldCheck, } from "lucide-react";
const widgets = [
    {
        title: "Open Investigations",
        description: "Access and manage your active investigations",
        icon: _jsx(Search, { className: "w-8 h-8 text-cyan-600" }),
        route: "/investigations",
        bg: "bg-cyan-50",
        hover: "hover:shadow-lg",
    },
    {
        title: "Reports",
        description: "Access report from closed investigations",
        icon: _jsx(BarChart2, { className: "w-8 h-8 text-purple-600" }),
        route: "/reports",
        bg: "bg-purple-50",
        hover: "hover:shadow-lg",
    },
    {
        title: "Cloud Inventory",
        description: "Manage your cloud resources and assets",
        icon: _jsx(Server, { className: "w-8 h-8 text-pink-600" }),
        route: "/inventory",
        bg: "bg-pink-50",
        hover: "hover:shadow-lg",
    },
    {
        title: "Cloud Standards",
        description: "Monitor compliance with security standards",
        icon: _jsx(ShieldCheck, { className: "w-8 h-8 text-red-600" }),
        route: "/standards",
        bg: "bg-red-50",
        hover: "hover:shadow-lg",
    },
];
const Dashboard = () => {
    const navigate = useNavigate();
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6", children: widgets.map((widget, index) => (_jsxs("div", { onClick: () => navigate(widget.route), className: `cursor-pointer rounded-xl p-6 ${widget.bg} ${widget.hover} transition-all duration-200 shadow-sm`, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [widget.icon, _jsx("span", { className: "text-sm bg-white text-gray-700 px-3 py-1 rounded-full shadow", children: "View all" })] }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: widget.title }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: widget.description })] }, index))) }));
};
export default Dashboard;
