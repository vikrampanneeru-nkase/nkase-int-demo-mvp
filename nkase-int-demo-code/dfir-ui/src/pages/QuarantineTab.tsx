import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
import { useState } from "react";

type ActivityLog = {
  id: string;
  account_id: string;
  instance_id: string;
  vpc_id?: string;
  action: string;
  status: string;
  message?: string;
  performed_at: string;
};

export default function QuarantineTab() {
  const { data, isLoading, error } = useQuery<ActivityLog[]>({
    queryKey: ["dashboard"],
    queryFn: () => fetcher("dashboard"),
  });

  const [accountIdFilter, setAccountIdFilter] = useState("");
  const [instanceIdFilter, setInstanceIdFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading quarantine data</p>;
  if (!data || data.length === 0) return <p>No quarantine data found.</p>;

  const filteredData = data.filter((log) => {
    return (
      (accountIdFilter === "" || log.account_id === accountIdFilter) &&
      (instanceIdFilter === "" || log.instance_id === instanceIdFilter) &&
      (actionFilter === "" || log.action === actionFilter)
    );
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select className="border p-2 rounded" value={accountIdFilter} onChange={(e) => setAccountIdFilter(e.target.value)}>
          <option value="">All Account IDs</option>
          {[...new Set(data.map((d) => d.account_id))].map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
        <select className="border p-2 rounded" value={instanceIdFilter} onChange={(e) => setInstanceIdFilter(e.target.value)}>
          <option value="">All Instance IDs</option>
          {[...new Set(data.map((d) => d.instance_id))].map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
        <select className="border p-2 rounded" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
          <option value="">All Actions</option>
          {[...new Set(data.map((d) => d.action))].map((action) => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full border border-gray-300 text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 font-semibold text-base">
          <tr>
            <th className="p-3 border">Account ID</th>
            <th className="p-3 border">Instance ID</th>
            <th className="p-3 border">VPC ID</th>
            <th className="p-3 border">Action</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Message</th>
            <th className="p-3 border">Performed At</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((log) => (
            <tr key={log.id} className="hover:bg-blue-50 text-gray-800">
              <td className="p-3 border">{log.account_id}</td>
              <td className="p-3 border">{log.instance_id}</td>
              <td className="p-3 border">{log.vpc_id}</td>
              <td className="p-3 border">{log.action}</td>
              <td className={`p-3 border ${log.status === "success" ? "text-green-600" : "text-red-600"}`}>
                {log.status}
              </td>
              <td className="p-3 border">{log.message}</td>
              <td className="p-3 border">{new Date(log.performed_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

