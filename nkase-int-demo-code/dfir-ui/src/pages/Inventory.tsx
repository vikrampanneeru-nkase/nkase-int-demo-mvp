import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../api/fetcher";

export default function Inventory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => fetcher("inventory"),
  });

  if (isLoading) return <div>Loading inventory...</div>;
  if (error) return <div>Error loading inventory</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Cloud Inventory</h2>
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