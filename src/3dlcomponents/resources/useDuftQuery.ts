import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import config from "../../config";
import { useDuftConfigurations } from "../../context/ConfigContext";
import { DuftHttpClient } from "../../api/DuftHttpClient/DuftHttpClient";

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

const client = new DuftHttpClient(config.apiBaseUrl);

const fetchDuftData = async <T>(requestPayload: RequestData): Promise<T> => {
  let response = await client.getQueryData(requestPayload);

  return response;
};

const useDuftQuery = <T>(requestPayload: RequestData): DuftQueryResult<T> => {
  const { accessToken } = useAuth();
  const authenticationEnabled = useDuftConfigurations();

  const { data, error, isLoading } = useQuery({
    queryKey: ["duftQuery", requestPayload],
    queryFn: () => fetchDuftData<T>(requestPayload),
    enabled:
      !!requestPayload?.query && (!authenticationEnabled || !!accessToken),
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    error: error instanceof Error ? error : null,
  };
};

export default useDuftQuery;
