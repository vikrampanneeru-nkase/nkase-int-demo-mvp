// src/pages/Settings.tsx
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/api/fetcher";

export default function Settings() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: () => fetcher("settings"),
  });

  if (isLoading) return <p>Loading settings...</p>;
  if (error) return <p>Error loading settings</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
