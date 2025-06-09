import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter, SortDesc, Server, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'critical':
            return 'bg-destructive';
        case 'high':
            return 'bg-primary';
        case 'medium':
            return 'bg-secondary';
        case 'low':
            return 'bg-accent';
        default:
            return 'bg-secondary';
    }
};
const getDueDateColor = (daysLeft) => {
    if (daysLeft <= 1)
        return 'text-destructive';
    if (daysLeft <= 3)
        return 'text-warning';
    return 'text-success';
};
export default function ActiveCases({ cases }) {
    return (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { className: "text-lg font-semibold", children: "Open & In-Progress Investigations" }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "text-sm bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200", children: [_jsx(Filter, { className: "h-4 w-4 mr-1" }), " Filter"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "text-sm bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200", children: [_jsx(SortDesc, { className: "h-4 w-4 mr-1" }), " Sort"] })] })] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "space-y-4", children: cases.map((caseItem) => (_jsx(Link, { href: `/cases/${caseItem.id}`, children: _jsx("a", { className: "block", children: _jsxs("div", { className: "border border-neutral-200 rounded-lg p-4 hover:border-primary cursor-pointer transition-colors", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-sm text-neutral-500 mb-1", children: ["Investigation #", caseItem.caseNumber] }), _jsx("h3", { className: "font-medium text-neutral-800", children: caseItem.title }), _jsxs("div", { className: "mt-2 text-sm text-neutral-600", children: ["Last updated: ", caseItem.updatedAt] })] }), _jsxs(Badge, { className: cn("text-white", getPriorityColor(caseItem.priority)), children: [caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1), " Priority"] })] }), _jsxs("div", { className: "mt-4 flex items-center text-sm flex-wrap gap-y-2", children: [_jsxs("div", { className: "text-neutral-600 flex items-center mr-4", children: [_jsx(Server, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: [caseItem.evidenceCount, " Evidence Items"] })] }), _jsxs("div", { className: "text-neutral-600 flex items-center mr-4", children: [_jsx(User, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: ["Assigned: ", caseItem.assignedTo] })] }), _jsxs("div", { className: cn("flex items-center", getDueDateColor(caseItem.dueDaysLeft)), children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), _jsx("span", { children: caseItem.dueDaysLeft <= 0
                                                                ? 'Due today'
                                                                : caseItem.dueDaysLeft === 1
                                                                    ? 'Due tomorrow'
                                                                    : `Due in ${caseItem.dueDaysLeft} days` })] })] })] }) }) }, caseItem.id))) }), _jsx("div", { className: "mt-6 text-center", children: _jsx(Link, { href: "/cases", children: _jsxs("a", { className: "text-primary hover:text-secondary text-sm", children: ["View All Investigations ", _jsx("span", { "aria-hidden": "true", children: "\u2192" })] }) }) })] })] }));
}
