import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
import { Link } from "react-router-dom";

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

  const handleJobClick = async (jobId: string) => {
    try {
      const jobDetail = await fetcher(`investigations/mitigation/status/${jobId}`);
      console.log("Job details:", jobDetail);
      alert(`Fetched job ${jobId}:\n${JSON.stringify(jobDetail, null, 2)}`);
    } catch (err) {
      console.error("Failed to fetch job details", err);
      alert("Failed to fetch job details");
    }
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
    </div>
  );
}

