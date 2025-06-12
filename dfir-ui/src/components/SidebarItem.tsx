// src/components/SidebarItem.tsx
import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

export default function SidebarItem({ icon, label, to }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition font-medium ${
          isActive
            ? "bg-white/20 text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
