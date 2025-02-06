import { useAppState } from "../../core/context/AppStateContext";
import App from "../App";
import Login from "../../authentication/login";
import Splash from "../app-utils/splash";
import { GlobalState } from "../../core/context/types";
import { useInitializeConfig } from "../hooks/useInitializeConfig";
import { DuftHttpClient } from "../../core/api/DuftHttpClient/DuftHttpClient";
import SetupSplash from "./setup-splash";

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
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Do we do OOBE?</div>
      </div>
    );
  } else if (state.state === GlobalState.APP_SETUP) {
    return <SetupSplash />;
  } else if (state.state === GlobalState.APP_MAIN) {
    return <App />;
  } else if (state.state === GlobalState.AUTH_REQUIRED) {
    return <Login />;
  }

  return null;
};

export default AppInitializer;
