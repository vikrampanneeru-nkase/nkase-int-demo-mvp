import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Sidebar from './Sidebar';
const Layout = ({ children }) => {
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex flex-col flex-1", children: [_jsx("header", { className: "bg-gray-100 shadow-md p-4", children: _jsx("h1", { className: "text-xl font-semibold", children: "Investigation Platform" }) }), _jsx("main", { className: "p-4 overflow-y-auto", children: children })] })] }));
};
export default Layout;
