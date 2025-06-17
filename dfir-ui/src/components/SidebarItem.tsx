// src/components/SidebarItem.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

export default function SidebarItem({ icon, label, to }: SidebarItemProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = location.pathname === to;

  return (
    <div
      className={clsx(
        "flex items-center gap-3 px-4 py-2 rounded-xl text-sm cursor-pointer transition",
        isActive
          ? "bg-sidebar-active text-white font-medium"
          : "text-white/80 hover:bg-sidebar-hover hover:text-white"
      )}
      onClick={() => navigate(to)}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="truncate">{label}</span>
    </div>
  );
}

