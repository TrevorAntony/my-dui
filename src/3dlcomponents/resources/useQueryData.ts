import { useQuery } from "@tanstack/react-query";
import { DuftHttpClient } from "../../api/DuftHttpClient/DuftHttpClient";
import { useDatasetContext } from "../../3dl/utilities/Dataset2";
import {
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
  updateConfigFromHttpClient,
  getRefreshToken,
} from "../../api/DuftHttpClient/local-storage-functions";
import config from "../../config";

interface QueryResult<T> {
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

const defaultClient = new DuftHttpClient(
  config.apiBaseUrl || `${window.location.origin}/api/v2`,
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
  updateConfigFromHttpClient,
  getRefreshToken
);

const useQueryData = <T>(
  requestPayload: RequestData,
  customClient?: DuftHttpClient
): QueryResult<T> => {
  const client = customClient || defaultClient;
  const { setData } = useDatasetContext();

  const { isLoading, error } = useQuery({
    queryKey: ["queryData", requestPayload],
    queryFn: async () => {
      const result = await client.getQueryData(requestPayload);
      setData(result);
      return result;
    },
    enabled: !!requestPayload?.query,
    refetchOnWindowFocus: false,
  });

  return {
    data: undefined, // Still keeping this undefined as we use context
    isLoading,
    error: error instanceof Error ? error : null,
  };
};

export default useQueryData;
