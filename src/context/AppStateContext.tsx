import type { ReactNode } from "react";
import React, { createContext, useReducer, useContext, useEffect } from "react";
import DispatchService from "../services/dispatchService";
import type { Config } from "./types";
import { GlobalState, type AppState, type AppStateAction } from "./types";
import { clearTokensFromLocalStorage } from "../api/DuftHttpClient/local-storage-functions";

// First add the enum
const initialState: AppState = {
  config: null,
  state: GlobalState.SPLASH,
};

const updateGlobalState = (config: Config): GlobalState => {
  console.log(config);
  if (!config.features.user_authentication) {
    return GlobalState.APP_READY;
  }

  return config.currentUser ? GlobalState.APP_READY : GlobalState.AUTH_REQUIRED;
};

function appStateReducer(state: AppState, action: AppStateAction): AppState {
  switch (action.type) {
    case "SET_CONFIG": {
      if (
        action.payload.features &&
        !action.payload.features.user_authentication
      ) {
        clearTokensFromLocalStorage();
      }
      const newState = updateGlobalState(action.payload);

      return {
        ...state,
        config: action.payload,
        state: newState,
      };
    }
    case "SET_STATE":
      return {
        ...state,
        state: action.payload,
      };
    default:
      return state;
  }
}

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppStateAction>;
} | null>(null);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);

  // Initialize the dispatch service
  useEffect(() => {
    DispatchService.setDispatch(dispatch);
  }, []);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

// Custom Hook for consuming the context
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
