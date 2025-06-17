import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetcher } from "../api/fetcher";
import apiClient from "@/api/client";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type EC2Instance = {
  id: string;
  name: string;
  instance_type: string;
  state: string;
  availability_zone: string;
  private_ip: string;
  public_ip: string | null;
  volume_ids: string[];
  is_quarantined?: boolean;
};

const stateColors: Record<string, string> = {
  running: "bg-green-100 text-green-800",
  stopped: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
  terminated: "bg-gray-200 text-gray-600",
};

export default function NewInvestigationsPage() {
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionResults, setActionResults] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery<EC2Instance[]>({
    queryKey: ["investigations_new"],
    queryFn: async () => {
      const raw = await fetcher("investigations/new");
      return raw.map((item: any): EC2Instance => {
        const nameTag = item.Tags?.find((tag: any) => tag.Key === "Name");
        return {
          id: item.InstanceId,
          name: nameTag?.Value || "Unnamed",
          instance_type: item.InstanceType,
          state: item.State?.toLowerCase() ?? "unknown",
          availability_zone: item.AvailabilityZone,
          private_ip: item.PrivateIpAddress,
          public_ip: item.PublicIpAddress || null,
          volume_ids: item.VolumeIds || [],
          is_quarantined: item.is_quarantined ?? false,
        };
      });
    },
  });

  const handleAction = async (
    instanceId: string,
    action: "Quarantine" | "Un-Quarantine" | "Mitigate"
  ) => {
    setLoadingId(instanceId);
    setActionMessage(null);
    setActionResults([]);

    try {
      const response = await apiClient.post(`/investigations/${action}`, {
        instance_ids: [instanceId],
      });

      const results = response.data as string[];
      setActionResults(results);

      const match = results[0]?.match(/job id: ([a-f0-9\-]+)/i);
      const jobId = match?.[1];

      toast.success(`${action} action complete.`);
      await refetch();
    } catch (err: any) {
      const msg = `Error during ${action}: ${err.message}`;
      setActionMessage(msg);
      toast.error(msg);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Investigations</h2>

      {actionMessage && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4 border border-red-300">
          {actionMessage}
        </div>
      )}
      {actionResults.length > 0 && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 border border-green-300">
          {actionResults.map((line, i) => (
            <div key={i}>{line.replace("status : ", "")}</div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((instance) => (
          <InstanceCard
            key={instance.id}
            instance={instance}
            loading={loadingId === instance.id}
            onAction={handleAction}
          />
        ))}
      </div>
    </div>
  );
}

function InstanceCard({
  instance,
  loading,
  onAction,
}: {
  instance: EC2Instance;
  loading: boolean;
  onAction: (id: string, action: "Quarantine" | "Un-Quarantine" | "Mitigate") => void;
}) {
  const stateClass = stateColors[instance.state] || "bg-gray-100 text-gray-700";

  const options = instance.is_quarantined
    ? ["Un-Quarantine", "Mitigate"]
    : ["Quarantine", "Mitigate"];

  return (
    <div className="bg-white rounded-xl shadow p-5 border flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{instance.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${stateClass}`}>
          {instance.state}
        </span>
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        <div><strong>ID:</strong> {instance.id}</div>
        <div><strong>Type:</strong> {instance.instance_type}</div>
        <div><strong>AZ:</strong> {instance.availability_zone}</div>
        <div><strong>Private IP:</strong> {instance.private_ip}</div>
        <div><strong>Public IP:</strong> {instance.public_ip || "N/A"}</div>
        <div><strong>Volumes:</strong>
          <ul className="list-disc list-inside">
            {instance.volume_ids.map((vol, idx) => (
              <li key={idx}>{vol}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Quarantine:</strong>{" "}
          <span className={instance.is_quarantined ? "text-red-600" : "text-green-600"}>
            {instance.is_quarantined ? "Yes" : "No"}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <select
          className="w-full border px-3 py-2 rounded"
          onChange={(e) =>
            e.target.value &&
            onAction(instance.id, e.target.value as "Quarantine" | "Un-Quarantine" | "Mitigate")
          }
          disabled={loading}
          defaultValue=""
        >
          <option value="" disabled>
            Select Action
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {loading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
            <FaSpinner className="animate-spin" /> Processing...
          </div>
        )}
      </div>
    </div>
  );
}

