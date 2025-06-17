// src/App.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import Investigations from "@/pages/Investigations";
import Dashboard from "@/pages/Dashboard";
import NewInvestigationsPage from "./pages/NewInvestigationsPage";

import Reports from "@/pages/Reports";
import Tools from "@/pages/Tools";
import Standards from "@/pages/Standards";
import Inventory from "@/pages/Inventory";
import Overview from "@/pages/Overview";
import Settings from "@/pages/Settings";

function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-4 bg-gradient-to-br from-cyan-700 to-blue-900 text-white flex-1 overflow-auto">
          {/* Toast Notification Area */}
          <Toaster position="top-right" reverseOrder={false} />
          
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Define routes for all pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investigations" element={<Investigations />} />
            <Route path="/newinvestigations" element={<NewInvestigationsPage />} />
<Route path="/newinvestigations" element={<NewInvestigationsPage />} />
<Route path="/newinvestigations/:case_number" element={<NewInvestigationsPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/standards" element={<Standards />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
