import { useState, useEffect } from "react";
import config from "../../config";

const useQuery = (query) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const payload = {
          query,
          data_connection_id: config.dataConnection,
        };

        const response = await fetch(
          "http://localhost:8000/api/v2/query-engine",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " +
              result.message +
              "\n" +
              "Original query: " +
              query,
          );
        }

        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [query]);

  return { data, loading, error };
};

export default useQuery;
