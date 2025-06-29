import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, FileText, Wrench, Shield, Database, PieChart, Settings, Folder, } from "lucide-react";
import SidebarItem from "./SidebarItem";
export default function Sidebar() {
    const navigate = useNavigate();
    const handleNewInvestigation = () => {
        navigate("/newinvestigations");
    };
    const mainItems = [
        { icon: _jsx(LayoutDashboard, { size: 18 }), label: "Dashboard", to: "/dashboard" },
        { icon: _jsx(Briefcase, { size: 18 }), label: "Investigations", to: "/investigations" },
        { icon: _jsx(FileText, { size: 18 }), label: "Reports", to: "/reports" },
        { icon: _jsx(Wrench, { size: 18 }), label: "Tools", to: "/tools" },
        { icon: _jsx(Shield, { size: 18 }), label: "Cloud Standards Enforcements", to: "/standards" },
        { icon: _jsx(Database, { size: 18 }), label: "Cloud Inventory", to: "/inventory" },
    ];
    const managementItems = [
        { icon: _jsx(PieChart, { size: 18 }), label: "CISO Overview", to: "/overview" },
        { icon: _jsx(Settings, { size: 18 }), label: "Settings", to: "/settings" },
    ];
    const recentInvestigations = [
        { icon: _jsx(Folder, { size: 18 }), label: "Network Intrusion Inves...", to: "/investigations/network" },
        { icon: _jsx(Folder, { size: 18 }), label: "Forensic Analysis", to: "/investigations/forensics" },
        { icon: _jsx(Folder, { size: 18 }), label: "Malware Investigation", to: "/investigations/malware" },
    ];
    return (_jsxs("div", { className: "h-screen w-72 bg-[#101828] text-white flex flex-col justify-between p-4 z-20 shadow-lg", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 px-2 mb-6", children: [_jsx("div", { className: "bg-cyan-400 p-2 rounded-xl", children: _jsx(Shield, { className: "text-white w-5 h-5" }) }), _jsx("h1", { className: "text-xl font-semibold", children: " NKASE " })] }), _jsx("div", { className: "mb-6 px-2", children: _jsxs("button", { onClick: handleNewInvestigation, className: "w-full flex items-center gap-2 px-4 py-2 rounded-2xl text-black font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 shadow-md transition", children: [_jsx(FolderPlus, { size: 20 }), "New Investigation"] }) }), _jsx("div", { className: "space-y-1 px-2", children: mainItems.map(({ icon, label, to }) => (_jsx(SidebarItem, { icon: icon, label: label, to: to }, to))) }), _jsxs("div", { className: "border-t border-white/20 mt-6 pt-4 px-2", children: [_jsx("p", { className: "text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-wide", children: "Management" }), managementItems.map(({ icon, label, to }) => (_jsx(SidebarItem, { icon: icon, label: label, to: to }, to)))] })] }), _jsxs("div", { className: "mt-6 px-2", children: [_jsx("p", { className: "text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-wide", children: "Recent Investigations" }), recentInvestigations.map(({ icon, label, to }) => (_jsx(SidebarItem, { icon: icon, label: label, to: to }, to)))] })] }));
}
