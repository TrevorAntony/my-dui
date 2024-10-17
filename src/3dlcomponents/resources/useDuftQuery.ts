import { useQuery } from "@tanstack/react-query";
import config from "../../config";

interface DuftQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

type RequestData = {
  query: string;
  data_connection_id: string;
  filters?: Record<string, unknown>;
  search_text?: string;
  search_columns?: string[];
  sort_column?: string;
  page_size?: number;
  current_page?: number;
};

const fetchDuftData = async <T>(requestPayload: RequestData): Promise<T> => {
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

const useDuftQuery = <T>(requestPayload: RequestData): DuftQueryResult<T> => {
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
