import { Bell, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetcher } from "@/api/fetcher";

type InProgressData = {
  in_progress_count: number;
  job_ids: string[];
};

export default function Header() {
  const [showTooltip, setShowTooltip] = useState(false);

  const {
    data = { in_progress_count: 0, job_ids: [] },
    isLoading,
    error,
  } = useQuery<InProgressData>({
    queryKey: ["in-progress-data"],
    queryFn: async () => await fetcher("dashboard/mitigations/in-progress/count"),
    refetchInterval: 120000,
  });

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-cyan-700 to-purple-900 text-white shadow-md">
        <h2 className="text-lg font-semibold">Home</h2>

        <div className="flex items-center gap-4">
          <input
            className="rounded-lg px-3 py-1 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            type="text"
            placeholder="Search..."
          />

          {/* Hoverable bell + tooltip container */}
          <div
            className="relative group"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="cursor-default">
              <Bell className="w-5 h-5 hover:text-cyan-300 transition" />
              {data.in_progress_count > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-red-600 text-white rounded-full px-1.5 py-0.5 leading-none">
                  {data.in_progress_count}
                </span>
              )}
            </div>

            {showTooltip && data.job_ids.length > 0 && (
              <div className="absolute top-6 right-0 bg-white text-black shadow-lg rounded-md text-xs z-50 p-2 w-60">
                <p className="font-semibold mb-2 text-gray-700">In-Progress Job IDs:</p>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {data.job_ids.map((id) => (
                    <li key={id} className="break-all">
                      {id}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <User className="w-6 h-6" />
            <span className="text-sm font-medium">NKASE_DEMO_TARGET</span>
          </div>
        </div>
      </header>
    </>
  );
}

