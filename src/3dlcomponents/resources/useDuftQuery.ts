import { useQuery } from "@tanstack/react-query";
import { client } from "../..";

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

const useDuftQuery = <T>(requestPayload: RequestData): DuftQueryResult<T> => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["duftQuery", requestPayload],
    queryFn: () => client.getQueryData(requestPayload),
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
