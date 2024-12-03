import { useState, useEffect } from "react";

type DteStatus = {
  is_running: boolean;
  current_script: string | null;
};

const useFetchDteStatus = () => {
  const [data, setData] = useState<DteStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v2/dte-status");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result: DteStatus = await response.json();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetchDteStatus;
