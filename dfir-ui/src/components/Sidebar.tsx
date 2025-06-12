// src/components/Sidebar.tsx
import React from "react";
import { FolderPlus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Wrench,
  Shield,
  Database,
  PieChart,
  Settings,
  Folder,
  Plus,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleNewInvestigation = () => {
    console.log("clicked New Investigation");
    navigate("/newinvestigations");
  };

  const mainItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", to: "/dashboard" },
    { icon: <Briefcase size={18} />, label: "Investigations", to: "/investigations" },
    { icon: <FileText size={18} />, label: "Reports", to: "/reports" },
    { icon: <Wrench size={18} />, label: "Tools", to: "/tools" },
    { icon: <Shield size={18} />, label: "Cloud Standards Enforcements", to: "/standards" },
    { icon: <Database size={18} />, label: "Cloud Inventory", to: "/inventory" },
  ];

  const managementItems = [
    { icon: <PieChart size={18} />, label: "CISO Overview", to: "/overview" },
    { icon: <Settings size={18} />, label: "Settings", to: "/settings" },
  ];

  const recentInvestigations = [
    { icon: <Folder size={18} />, label: "Network Intrusion Inves...", to: "/investigations/network" },
    { icon: <Folder size={18} />, label: "Forensic Analysis", to: "/investigations/forensics" },
    { icon: <Folder size={18} />, label: "Malware Investigation", to: "/investigations/malware" },
  ];

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-sidebar-start via-sidebar-mid to-sidebar-end p-4 flex flex-col justify-between text-white font-sans">
      <div>
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="bg-cyan-400 p-2 rounded-xl">
            <Shield className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold">DFIR Platform</h1>
        </div>

        <div className="mb-4">
         <button
        onClick={handleNewInvestigation}
        className="flex items-center gap-2 px-4 py-2 rounded-2xl text-black font-medium bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 shadow-md transition"
     >
            <FolderPlus size={20} />
      New Investigation
    </button>

          {mainItems.map(({ icon, label, to }) => (
            <SidebarItem key={to} icon={icon} label={label} to={to} />
          ))}
        </div>

        <div className="border-t border-white/20 mt-4 pt-4">
          <p className="text-[11px] font-semibold text-white/60 px-4 mb-2 uppercase tracking-wide">
            Management
          </p>
          {managementItems.map(({ icon, label, to }) => (
            <SidebarItem key={to} icon={icon} label={label} to={to} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold text-white/60 px-4 mb-2 uppercase tracking-wide">
          Recent Investigations
        </p>
        {recentInvestigations.map(({ icon, label, to }) => (
          <SidebarItem key={to} icon={icon} label={label} to={to} />
        ))}
      </div>
    </div>
  );
}
