// src/pages/Reports.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";

export default function Reports() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reports"],
    queryFn: () => fetcher("reports"),
  });

  if (isLoading) return <p>Loading reports...</p>;
  if (error) return <p>Error loading reports</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
