import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../api/fetcher";

export default function Overview() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["overview"],
    queryFn: () => fetcher("overview"),
  });

  if (isLoading) return <div>Loading overview...</div>;
  if (error) return <div>Error loading overview</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">CISO Overview</h2>
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
