import { useState } from "react";
import QuarantineTab from "./QuarantineTab";
import MitigationTab from "./MitigationTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"quarantine" | "mitigation">("quarantine");

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Activity Log Dashboard</h2>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === "quarantine" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("quarantine")}
        >
          Quarantine
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === "mitigation" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("mitigation")}
        >
          Mitigation
        </button>
      </div>

      {activeTab === "quarantine" ? <QuarantineTab /> : <MitigationTab />}
    </div>
  );
}

