import { useAppState } from "../../core/context/AppStateContext";
import App from "../App";
import Login from "../../authentication/login";
import Splash from "../app-utils/splash";
import { GlobalState } from "../../core/context/types";
import { useInitializeConfig } from "../hooks/useInitializeConfig";
import { DuftHttpClient } from "../../core/api/DuftHttpClient/DuftHttpClient";
import Setup from "../app-setup/setup";
import { useState, useEffect } from "react";
import SetupSplash from "../app-setup/setup-splash";

interface AppInitializerProps {
  customHttpClient?: DuftHttpClient;
}

const AppInitializer: React.FC<AppInitializerProps> = ({
  customHttpClient,
}) => {
  const { state } = useAppState();
  const [showSetupSplash, setShowSetupSplash] = useState(false);
  useInitializeConfig(customHttpClient);

  useEffect(() => {
    if (state.state === GlobalState.APP_SETUP) {
      setShowSetupSplash(true);
      const timer = setTimeout(() => {
        setShowSetupSplash(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return void 0;
  }, [state.state]);

  if (state.state === GlobalState.SPLASH) {
    return <Splash />;
  } else if (state.state === GlobalState.APP_READY) {
    return null; // Loading indicator
  } else if (state.state === GlobalState.APP_SETUP) {
    return showSetupSplash ? <SetupSplash /> : <Setup />;
  } else if (state.state === GlobalState.APP_MAIN) {
    return <App />;
  } else if (state.state === GlobalState.AUTH_REQUIRED) {
    return <Login />;
  }

  return null;
};

export default AppInitializer;
