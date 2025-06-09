import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx(Header, {}), _jsxs("main", { className: "p-4 bg-gradient-to-br from-cyan-700 to-blue-900 text-white flex-1 overflow-auto", children: [_jsx(Toaster, { position: "top-right", reverseOrder: false }), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/investigations", element: _jsx(Investigations, {}) }), _jsx(Route, { path: "/newinvestigations", element: _jsx(NewInvestigationsPage, {}) }), _jsx(Route, { path: "/reports", element: _jsx(Reports, {}) }), _jsx(Route, { path: "/tools", element: _jsx(Tools, {}) }), _jsx(Route, { path: "/standards", element: _jsx(Standards, {}) }), _jsx(Route, { path: "/inventory", element: _jsx(Inventory, {}) }), _jsx(Route, { path: "/overview", element: _jsx(Overview, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) })] })] })] })] }));
}
export default App;
