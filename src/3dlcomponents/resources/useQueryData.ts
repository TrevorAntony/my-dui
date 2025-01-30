import { useQuery } from "@tanstack/react-query";
import { DuftHttpClient } from "../../api/DuftHttpClient/DuftHttpClient";
import {
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
  updateConfigFromHttpClient,
  getRefreshToken,
} from "../../api/DuftHttpClient/local-storage-functions";
import config from "../../config";

// This is commented out for tests to pass, since the http client which is exported from the index file
// is not provided in the context of the test and throws an error
// TO-DO: create the singleton client in a location that is accessibqle to the tests and then reinstatiate this import and its usage.

interface QueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

type RequestData = {
  query?: string;
  query_name?: string;
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

const validatePayload = (payload: RequestData) => {
  if (payload?.query && payload?.query_name) {
    throw new Error(
      "Invalid request payload: Cannot specify both 'query' and 'query_name'. Use only one."
    );
  }

  if (!payload?.query && !payload?.query_name) {
    throw new Error(
      "Invalid request payload: Must specify either 'query' or 'query_name'."
    );
  }
};

const useQueryData = <T>(
  requestPayload: RequestData,
  customClient?: DuftHttpClient
): QueryResult<T> => {
  const client = customClient || defaultClient;
  const { data, isLoading, error } = useQuery({
    queryKey: ["queryData", requestPayload],
    queryFn: async () => {
      validatePayload(requestPayload);

      const result = requestPayload?.query
        ? await client.getQueryData(requestPayload)
        : requestPayload?.query_name
        ? await client.getServerQueryData(requestPayload)
        : null;
      return result;
    },
    enabled: !!requestPayload?.query || !!requestPayload?.query_name,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    error: error instanceof Error ? error : null,
  };
};

export default useQueryData;
