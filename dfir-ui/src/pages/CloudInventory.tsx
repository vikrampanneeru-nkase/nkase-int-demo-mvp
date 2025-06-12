// src/pages/CloudInventory.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";

export default function CloudInventory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => fetcher("inventory"),
  });

  if (isLoading) return <p>Loading inventory...</p>;
  if (error) return <p>Error loading inventory</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cloud Inventory</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
