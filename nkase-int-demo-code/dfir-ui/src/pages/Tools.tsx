// src/pages/Tools.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";

export default function Tools() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tools"],
    queryFn: () => fetcher("tools"),
  });

  if (isLoading) return <p>Loading tools...</p>;
  if (error) return <p>Error loading tools</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tools</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
