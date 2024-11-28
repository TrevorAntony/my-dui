import { useEffect } from "react";
import { useAppState } from "../context/AppStateContext";
import App from "../App";
import Login from "./login";
import Splash from "./splash";
import { GlobalState } from "../context/types";
import { UnauthorizedError } from "../api/DuftHttpClient/ErrorClasses";
import { client } from "..";

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

  return null;
};

export default AppInitializer;
