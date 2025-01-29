import { useAppState } from "../context/AppStateContext";
import App from "../App";
import Login from "./login";
import Splash from "./splash";
import { GlobalState } from "../context/types";
import { useInitializeConfig } from "../hooks/useInitializeConfig";
import { DuftHttpClient } from "../api/DuftHttpClient/DuftHttpClient";

interface AppInitializerProps {
  customHttpClient?: DuftHttpClient;
}

const AppInitializer: React.FC<AppInitializerProps> = ({
  customHttpClient,
}) => {
  const { state } = useAppState();
  useInitializeConfig(customHttpClient);

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
