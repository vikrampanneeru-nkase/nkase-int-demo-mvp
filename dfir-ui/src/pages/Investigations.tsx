import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetcher } from "../api/fetcher";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

interface Investigation {
  case_number: string;
  title: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Closed" | "Archived";
  assigned_to: string;
  updated_at: string;
  created_at: string;
}

const priorityColor: Record<Investigation["priority"], string> = {
  Critical: "bg-red-500 text-white",
  High: "bg-green-400 text-white",
  Medium: "bg-teal-300 text-white",
  Low: "bg-yellow-400 text-white",
};

const statusColor: Record<Investigation["status"], string> = {
  Open: "bg-teal-200 text-black",
  "In Progress": "bg-teal-400 text-white",
  Closed: "bg-gray-300 text-black",
  Archived: "bg-purple-300 text-white",
};

const tabs: Investigation["status"][] = ["Open", "In Progress", "Closed", "Archived"];

export default function Investigations() {
  const [filter, setFilter] = useState<"All" | Investigation["status"]>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Investigation["priority"]>("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["investigations"],
    queryFn: () => fetcher("investigations"),
  });

  const investigations = (data as Investigation[]) || [];

  const filteredData = investigations.filter((item) => {
    const matchesStatus = filter === "All" || item.status === filter;
    const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchLower) ||
      item.case_number.toLowerCase().includes(searchLower);
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getLatestCaseNumber = () => {
    if (investigations.length === 0) return "";
    const sorted = [...investigations].sort((a, b) => b.case_number.localeCompare(a.case_number));
    return sorted[0].case_number;
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Investigations</h1>
        <p className="text-sm text-gray-500">Manage and track all digital forensic investigations</p>
      </div>

      {/* New Investigation button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            const latest = getLatestCaseNumber();
            navigate(`/newinvestigations/${latest}`);
          }}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Investigation</span>
        </button>
      </div>

      <div className="bg-cyan-50 rounded-xl p-4 shadow space-y-4">
        {/* Tabs */}
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === "All"
                ? "bg-purple-700 text-white"
                : "bg-white text-gray-800 border border-gray-300"
            }`}
          >
            All Investigations
          </button>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === tab
                  ? "bg-purple-700 text-white"
                  : "bg-white text-gray-800 border border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Priority Filter */}
        <div className="flex justify-between items-center gap-4">
          <input
            type="text"
            placeholder="🔍 Search investigations..."
            className="px-4 py-2 border border-gray-300 rounded-lg flex-1 max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-gray-500">Loading investigations...</div>
        ) : error ? (
          <div className="text-red-600">Error loading data</div>
        ) : filteredData.length === 0 ? (
          <div className="text-gray-500">No investigations found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="py-2 px-3">Case Number</th>
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Priority</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Assigned To</th>
                  <th className="py-2 px-2">Created</th>
                  <th className="py-2 px-3">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => navigate(`/newinvestigations/${item.case_number}`)}
                    className={`border-b cursor-pointer hover:bg-cyan-100 ${
                      item.priority === "Critical" ? "bg-red-50" : "bg-white"
                    }`}
                  >
                    <td className="py-2 px-3 font-medium text-gray-800">{item.case_number}</td>
                    <td className="py-2 px-3 text-blue-800 underline">{item.title}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          priorityColor[item.priority]
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          statusColor[item.status]
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium text-gray-800">{item.assigned_to}</td>
                    <td className="py-2 px-2 font-medium text-gray-800">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 font-medium text-gray-800">
                      {new Date(item.updated_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

