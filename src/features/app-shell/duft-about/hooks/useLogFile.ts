import { useState, useEffect } from "react";
import { client } from "../../../../core/api/DuftHttpClient/local-storage-functions";

export const useLogFile = (isOpen: boolean) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!isOpen) return;
      setLoading(true);
      setError(null);
      try {
        const response = await client.getLogFile();
        setLogs(response.content);
      } catch (err) {
        setError("Failed to load log file");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [isOpen]);

  return { logs, loading, error };
};

export const downloadLogs = (logs: string[]) => {
  const content = logs.join("\n");
  const blob = new Blob([content], { type: "text/plain" });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `duft-logs-${new Date().toISOString().split("T")[0]}.txt`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
