import { useState, useEffect } from "react";
import config from "../../config";

// Define the types for the function
interface DuftQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const useDuftQuery = <T>(
  query: string,
  dataConnection: string
): DuftQueryResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Prepare the payload
        const payload = {
          query,
          data_connection_id: dataConnection || config.dataConnection, // Hardcoded data connection ID
        };

        // Make the API request
        const response = await fetch(
          "http://localhost:8000/api/v2/query-engine",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const result: T = await response.json();

        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " +
              (result as any).message +
              "\n" +
              "Original query: " +
              query
          );
        }

        setData(result); // Assuming the data is of type T
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
  }, [query, dataConnection]);

  return { data, loading, error };
};

export default useDuftQuery;
