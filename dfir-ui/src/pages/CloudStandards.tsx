// src/pages/CloudStandards.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";

export default function CloudStandards() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["standards"],
    queryFn: () => fetcher("standards"),
  });

  if (isLoading) return <p>Loading standards...</p>;
  if (error) return <p>Error loading standards</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cloud Standards</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
