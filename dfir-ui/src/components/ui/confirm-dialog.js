import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@/components/ui/alert-dialog';
export function ConfirmDialog({ title, description, onConfirm, onCancel }) {
    return (_jsx(AlertDialog, { defaultOpen: true, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: title }), _jsx(AlertDialogDescription, { children: description })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { onClick: onCancel, children: "Cancel" }), _jsx(AlertDialogAction, { onClick: onConfirm, children: "Confirm" })] })] }) }));
}
