import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel, }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-xl w-full max-w-md", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: message }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx("button", { onClick: onCancel, className: "px-4 py-2 bg-gray-300 rounded hover:bg-gray-400", children: "No" }), _jsx("button", { onClick: onConfirm, className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700", children: "Yes, Isolate" })] })] }) }));
};
