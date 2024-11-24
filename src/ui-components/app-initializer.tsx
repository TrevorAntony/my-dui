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
  return useQuery({
    queryKey: ["config"], // Unique identifier for this query
    queryFn: () => client.getCurrentConfig(), // Fetch function
    staleTime: Infinity, // Data is always fresh during the lifecycle of the app
    cacheTime: 0, // Remove cached data on browser refresh
    refetchOnWindowFocus: false, // No refetch on window focus
    refetchOnMount: false, // No refetch on component remount
    refetchOnReconnect: false, // No refetch on network reconnect
    retry: 2, // Retry on failure
  });
};

const AppInitializer: React.FC = () => {
  const { state } = useAppState();
  const { isError, error, isLoading } = useCurrentConfig();

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
          Failed to load configuration. Please try again later.
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
