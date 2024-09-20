import { useQuery } from "@tanstack/react-query";
import config from "../../config";

// Define the types for the function
interface DuftQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

const fetchDuftData = async <T>(
  query: string,
  dataConnection: string
): Promise<T> => {
  const payload = {
    query,
    data_connection_id: dataConnection || config.dataConnection,
  };

  const response = await fetch(`${config.apiBaseUrl}/query-engine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Network response was not ok: ${errorMessage}`);
  }

  return response.json();
};

const useDuftQuery = <T>(
  query: string,
  dataConnection: string
): DuftQueryResult<T> => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["duftQuery", query, dataConnection],
    queryFn: () => fetchDuftData<T>(query, dataConnection),
    enabled: !!query,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    error: error instanceof Error ? error : null,
  };
};

export default useDuftQuery;
