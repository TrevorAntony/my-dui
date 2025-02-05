import { useAppState } from "../core/context/AppStateContext";
import App from "./App";
import Login from "../authentication/login";
import Splash from "./splash";
import { GlobalState } from "../core/context/types";
import { useInitializeConfig } from "./useInitializeConfig";
import { DuftHttpClient } from "../core/api/DuftHttpClient/DuftHttpClient";

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
