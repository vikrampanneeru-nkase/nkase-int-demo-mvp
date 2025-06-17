import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
import { useState } from "react";

type MitigationJob = {
  job_id: string;
  instance_id: string;
  stage: string;
  created_at: string;
  updated_at: string;
  error_message?: string;
};

const stageColor: Record<string, string> = {
  completed: "text-green-600",
  failed: "text-red-600",
  started: "text-yellow-600",
};

const getStageProgress = (stage: string) => {
  const stages = ["started", "snapshot", "volume", "detach", "completed"];
  const index = stages.indexOf(stage);
  return Math.max(0, ((index + 1) / stages.length) * 100);
};

export default function MitigationTab() {
  const { data, isLoading, error } = useQuery<MitigationJob[]>({
    queryKey: ["mitigation"],
    queryFn: () => fetcher("dashboard/mitigated"),
  });

  const [selectedJobDetail, setSelectedJobDetail] = useState<any[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleJobClick = async (jobId: string) => {
    try {
      const jobDetail = await fetcher(`investigations/mitigation/status/${jobId}`);
      setSelectedJobDetail(jobDetail);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch job details", err);
      alert("Failed to fetch job details");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJobDetail(null);
    setExpandedRow(null);
  };

  if (isLoading) return <p className="text-gray-700">Loading mitigation data...</p>;
  if (error) return <p className="text-red-600">Error loading mitigation data</p>;
  if (!data || data.length === 0) return <p>No mitigation jobs found.</p>;

  return (
    <div className="space-y-6 font-sans p-4 max-w-5xl mx-auto">
      {data.map((job) => (
        <div key={job.job_id} className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">
                Job ID:{" "}
                <button
                  onClick={() => handleJobClick(job.job_id)}
                  className="text-blue-600 hover:underline"
                >
                  {job.job_id}
                </button>
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Instance ID: {job.instance_id}
              </p>
              <p className={`text-md mt-1 ${stageColor[job.stage] || "text-gray-600"}`}>
                Stage: {job.stage}
              </p>
              {job.error_message && (
                <p className="text-red-500 text-sm mt-1">Error: {job.error_message}</p>
              )}
            </div>
            <div className="w-1/3">
              <div className="h-2 rounded bg-gray-200">
                <div
                  className="h-2 rounded bg-blue-500"
                  style={{ width: `${getStageProgress(job.stage)}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Started: {new Date(job.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(job.updated_at).toLocaleString()}</p>
          </div>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && selectedJobDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-6xl w-full">
            <h2 className="text-lg font-bold mb-4">
              Job Status: {selectedJobDetail[0]?.job_id}
            </h2>

            <div className="overflow-auto max-h-[60vh] max-w-full">
              <div className="min-w-[1000px]">
<table className="table-auto w-full text-sm border border-gray-300 text-gray-800 bg-white">
  <thead className="bg-gray-100 sticky top-0 z-10 text-gray-900">
    <tr>
      <th className="p-2 border border-gray-200">ID</th>
      <th className="p-2 border border-gray-200">Instance ID</th>
      <th className="p-2 border border-gray-200">Volume ID</th>
      <th className="p-2 border border-gray-200">Snapshot ID</th>
      <th className="p-2 border border-gray-200">Action</th>
      <th className="p-2 border border-gray-200">Status</th>
      <th className="p-2 border border-gray-200">Progress</th>
      <th className="p-2 border border-gray-200">Timestamp</th>
      <th className="p-2 border border-gray-200">Details</th>
    </tr>
  </thead>
  <tbody>
    {selectedJobDetail.map((item: any, index: number) => {
      const isExpanded = expandedRow === index;
      const isCompleted = item.status === "completed";
      const isFailed = item.status === "failed";

      return (
        <React.Fragment key={item.id}>
          <tr
            onClick={() => setExpandedRow(isExpanded ? null : index)}
            className={`cursor-pointer align-top ${
              isCompleted
                ? "bg-green-50"
                : isFailed
                ? "bg-red-50"
                : index % 2 === 0
                ? "bg-gray-50"
                : "bg-white"
            } hover:bg-blue-50`}
          >
            <td className="p-2 border border-gray-200">{item.id}</td>
            <td className="p-2 border border-gray-200">{item.instance_id}</td>
            <td className="p-2 border border-gray-200">{item.volume_id || "-"}</td>
            <td className="p-2 border border-gray-200">{item.snapshot_id || "-"}</td>
            <td className="p-2 border border-gray-200">{item.action}</td>
            <td className="p-2 border border-gray-200">{item.status}</td>
            <td className="p-2 border border-gray-200">{item.progress ?? "-"}</td>
            <td className="p-2 border border-gray-200">{item.timestamp}</td>
            <td className="p-2 border border-gray-200 text-blue-600 text-xs">
              {isExpanded ? "▲ Hide" : "▼ Show"}
            </td>
          </tr>
          {isExpanded && (
            <tr>
              <td colSpan={9} className="p-3 border border-gray-200 bg-gray-100 text-xs">
                <pre className="whitespace-pre-wrap font-mono text-gray-800">
                  {JSON.stringify(item.details, null, 2)}
                </pre>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    })}
  </tbody>
</table>

              </div>
            </div>

            <div className="text-right mt-4">
              <button
                onClick={closeModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

