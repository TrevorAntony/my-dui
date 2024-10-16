import { useQuery } from "@tanstack/react-query";
import config from "../../config";

// Define the types for the function
interface DuftQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

const fetchDuftData = async <T>(
  requestPayload: Record<string, any>,
): Promise<T> => {
  const response = await fetch(`${config.apiBaseUrl}/run-query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Network response was not ok: ${errorMessage}`);
  }

  return response.json();
};

const useDuftQuery = <T>(requestPayload: any): DuftQueryResult<T> => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["duftQuery", requestPayload],
    queryFn: () => fetchDuftData<T>(requestPayload),
    enabled: !!requestPayload?.query,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    error: error instanceof Error ? error : null,
  };
};

export default useDuftQuery;
