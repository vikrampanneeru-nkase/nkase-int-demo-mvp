import { useNavigate } from "react-router-dom";
import {
  Search,
  BarChart2,
  Server,
  ShieldCheck,
} from "lucide-react";

const widgets = [
  {
    title: "Open Investigations",
    description: "Access and manage your active investigations",
    icon: <Search className="w-8 h-8 text-cyan-600" />,
    route: "/investigations",
    bg: "bg-cyan-50",
    hover: "hover:shadow-lg",
  },
  {
    title: "Reports",
    description: "Access report from closed investigations",
    icon: <BarChart2 className="w-8 h-8 text-purple-600" />,
    route: "/reports",
    bg: "bg-purple-50",
    hover: "hover:shadow-lg",
  },
  {
    title: "Cloud Inventory",
    description: "Manage your cloud resources and assets",
    icon: <Server className="w-8 h-8 text-pink-600" />,
    route: "/inventory",
    bg: "bg-pink-50",
    hover: "hover:shadow-lg",
  },
  {
    title: "Cloud Standards",
    description: "Monitor compliance with security standards",
    icon: <ShieldCheck className="w-8 h-8 text-red-600" />,
    route: "/standards",
    bg: "bg-red-50",
    hover: "hover:shadow-lg",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {widgets.map((widget, index) => (
        <div
          key={index}
          onClick={() => navigate(widget.route)}
          className={`cursor-pointer rounded-xl p-6 ${widget.bg} ${widget.hover} transition-all duration-200 shadow-sm`}
        >
          <div className="flex justify-between items-center mb-4">
            {widget.icon}
            <span className="text-sm bg-white text-gray-700 px-3 py-1 rounded-full shadow">
              View all
            </span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{widget.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;

