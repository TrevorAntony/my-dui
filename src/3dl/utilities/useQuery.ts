import { useState, useEffect } from "react";
import config from "../../config";
import { DuftHttpClient } from "../../api/DuftHttpClient/DuftHttpClient";

const useQuery = (query) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const client = new DuftHttpClient(config.apiBaseUrl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const payload = {
          query,
          data_connection_id: config.dataConnection,
        };

        const response = await client.getQueryData(payload);

        setData(response);
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
