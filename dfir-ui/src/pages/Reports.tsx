// src/pages/Reports.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";
import { useState } from "react";

export default function Reports() {
  const [caseNumber, setCaseNumber] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["action_job_details", caseNumber],
    queryFn: () =>
      caseNumber ? fetcher(`investigations/nkase/logs?case_number=${caseNumber}`) : Promise.resolve([]),
    enabled: !!caseNumber,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Action Job Details by Case Number</h2>
      <input
        className="border px-2 py-1 mb-4"
        placeholder="Enter Case Number..."
        value={caseNumber}
        onChange={e => setCaseNumber(e.target.value)}
      />
      {isLoading && <p>Loading action job details...</p>}
      {error && <p>Error loading action job details</p>}
      {data && data.length > 0 ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        !isLoading && <p>No data found for this case number.</p>
      )}
    </div>
  );
}


