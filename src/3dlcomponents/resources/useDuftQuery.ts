import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
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

const fetchDuftData = async <T>(
  requestPayload: RequestData,
  accessToken: string,
  refreshAccessToken: () => Promise<string | undefined>,
  logout: () => void,
): Promise<T> => {
  const makeRequest = async (token: string): Promise<Response> => {
    return fetch(`${config.apiBaseUrl}/run-query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestPayload),
    });
  };

  let response = await makeRequest(accessToken);

  // If access token is expired, try refreshing it
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      response = await makeRequest(newAccessToken);
    } else {
      logout(); // Logout if refresh fails
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Network response was not ok: ${errorMessage}`);
  }

  return response.json();
};

const useDuftQuery = <T>(requestPayload: RequestData): DuftQueryResult<T> => {
  const { accessToken, refreshAccessToken, logout } = useAuth();

  const { data, error, isLoading } = useQuery({
    queryKey: ["duftQuery", requestPayload],
    queryFn: () =>
      fetchDuftData<T>(requestPayload, accessToken, refreshAccessToken, logout),
    enabled: !!requestPayload?.query && !!accessToken,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    error: error instanceof Error ? error : null,
  };
};

export default useDuftQuery;
