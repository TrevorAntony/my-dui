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
import Splash from "./splash";
import { GlobalState } from "../context/types";

const client = new DuftHttpClient(
  "http://127.0.0.1:8000/api/v2",
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
  updateConfigFromHttpClient
);

const useCurrentConfig = () => {
  const { state } = useAppState();
  const hasConfig = Boolean(state.config);

  return useQuery({
    queryKey: ["config"],
    queryFn: () => client.getCurrentConfig(), //the param is dependent on the state of the token.
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
  useCurrentConfig();

  if (state.state === GlobalState.SPLASH) {
    return <Splash />;
  } else if (state.state === GlobalState.APP_READY) {
    return <App />;
  } else if (state.state === GlobalState.AUTH_REQUIRED) {
    return <Login />;
  }
};

export default AppInitializer;
