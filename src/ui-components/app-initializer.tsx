import { useEffect } from "react";
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
import { UnauthorizedError } from "../api/DuftHttpClient/ErrorClasses";

const client = new DuftHttpClient(
  "http://127.0.0.1:8000/api/v2",
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
  updateConfigFromHttpClient
);

const AppInitializer: React.FC = () => {
  const { state } = useAppState();

  useEffect(() => {
    const initConfig = async () => {
      try {
        await client.getCurrentConfig();
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          // This is the better way
          await client.getCurrentConfig(false);
        }
      }
    };
    initConfig();
  }, []);

  if (state.state === GlobalState.SPLASH) {
    return <Splash />;
  } else if (state.state === GlobalState.APP_READY) {
    return <App />;
  } else if (state.state === GlobalState.AUTH_REQUIRED) {
    return <Login />;
  }
};

export default AppInitializer;
