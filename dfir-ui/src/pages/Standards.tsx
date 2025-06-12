import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../api/fetcher";

export default function Standards() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["standards"],
    queryFn: () => fetcher("standards"),
  });

  if (isLoading) return <div>Loading standards...</div>;
  if (error) return <div>Error loading standards</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Cloud Standards Enforcements</h2>
      <ul className="space-y-2">
        {data.map((item: any, index: number) => (
          <li key={index} className="bg-white p-3 rounded shadow">
            {item.title || JSON.stringify(item)}
          </li>
        ))}
      </ul>
    </div>
  );
}