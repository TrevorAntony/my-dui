import type { ReactNode } from "react";
import React, { createContext, useReducer, useContext, useEffect } from "react";
import DispatchService from "../services/dispatchService";
import type { AppState, AppStateAction } from "./types";

const initialState: AppState = {
  config: null,
};

function appStateReducer(state: AppState, action: AppStateAction): AppState {
  switch (action.type) {
    case "SET_CONFIG":
      return {
        ...state,
        config: action.payload,
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
