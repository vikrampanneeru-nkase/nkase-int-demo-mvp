import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ActionsDropdown = ({ resource, handlers }) => {
    const { handleViewActivity, handleRevokeAccess, handleTerminateAllSessions, handleDestroyResource, handleMarkCompromised, handleContainResource, } = handlers;
    return (_jsxs("div", { className: "dropdown", children: [_jsx("button", { onClick: () => handleViewActivity(resource.id), children: "View Activity" }), _jsx("button", { onClick: () => handleMarkCompromised(resource.id, !resource.compromised), children: resource.compromised ? "Unmark Compromised" : "Mark Compromised" }), _jsx("button", { onClick: () => handleContainResource(resource.id, !resource.contained), children: resource.contained ? "Release Containment" : "Contain Resource" })] }));
};
export default ActionsDropdown;
