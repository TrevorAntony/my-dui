import { useQuery } from "@tanstack/react-query";
import { useAppState } from "../context/AppStateContext";
import { DuftHttpClient } from "../api/DuftHttpClient/DuftHttpClient";
import {
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
  updateConfigFromHttpClient,
} from "../api/DuftHttpClient/local-storage-functions";
import App from "../App";
import Login from "./login";
import { checkAuthEnabled, checkUserLoggedIn } from "../utils/auth-utils";

const client = new DuftHttpClient(
  "http://127.0.0.1:8000/api/v2",
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
  updateConfigFromHttpClient
);

const useCurrentConfig = () => {
  const { state } = useAppState();
  const hasConfig = Boolean(state.config);
  const authToken = getTokenFromLocalStorage();

  return useQuery({
    queryKey: ["config"],
    queryFn: () => client.getCurrentConfig(Boolean(authToken)), //the param is dependent on the state of the token.
    staleTime: Infinity,
    cacheTime: Infinity,
    enabled: !hasConfig, // Only run if we don't have config in state
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

const AppInitializer: React.FC = () => {
  const { state } = useAppState();
  const { isLoading, error: isError } = useCurrentConfig();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading configuration...</div>
      </div>
    );
  }

  if (isError) {
    console.error("Failed to fetch configuration:", error);
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-600">
          Failed to load configuration. Please check your authentication status.
        </div>
      </div>
    );
  }

  const isAuthEnabled = checkAuthEnabled(state);
  const isLoggedIn = checkUserLoggedIn(state);

  // If auth is enabled and user is not logged in, show login
  if (isAuthEnabled && !isLoggedIn) {
    return <Login />;
  }

  return <App />;
};

export default AppInitializer;
