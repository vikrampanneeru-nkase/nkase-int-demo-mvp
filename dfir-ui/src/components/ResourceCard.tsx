// src/components/ResourceCard.tsx
import { useState, useRef, useEffect } from "react";

export const ResourceCard = ({
  title,
  instanceId,
  resourceType,
  status,
  awsRegion,
}: {
  title: string;
  instanceId: string;
  resourceType: string;
  status: string;
  awsRegion?: string;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex justify-between items-center border border-cyan-400 bg-cyan-100 p-4 rounded-md shadow-sm">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>🖥️</span>
          {title}
          <span className="text-sm bg-gray-200 px-2 py-0.5 rounded-full ml-2 text-gray-700 border">
            Not Contained
          </span>
        </h3>
        <p className="text-sm text-gray-700 mt-1">
          AWS Region: {awsRegion ?? "N/A"} &nbsp;•&nbsp; Type: {resourceType} &nbsp;•&nbsp;
          <span className="text-green-600">Status: {status}</span>
          <span className="inline-block ml-4 text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">
            ⚠️ Compromised
          </span>
        </p>
        <p className="text-sm mt-1">IP: 10.0.1.15</p>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="bg-cyan-400 hover:bg-cyan-500 text-black font-medium py-2 px-4 rounded-md"
        >
          Actions &nbsp;⋯
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10 border">
            <button className="w-full text-left px-4 py-2 hover:bg-cyan-100">📜 View Activity</button>
            <button className="w-full text-left px-4 py-2 hover:bg-cyan-100">❎ Unmark Compromised</button>
            <button className="w-full text-left px-4 py-2 hover:bg-cyan-100">🔓 Release Containment</button>
          </div>
        )}
      </div>
    </div>
  );
};

