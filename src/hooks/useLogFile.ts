import { useState, useEffect } from "react";
import { client } from "../index";

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
