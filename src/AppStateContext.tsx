// AppStateContext.tsx
import React, { createContext, useContext, useReducer } from "react";
import { AppState, AppStateContextProps } from "./api/types";

const AppStateContext = createContext<AppStateContextProps | undefined>(
  undefined
);

const appStateReducer = (
  state: AppState,
  action: { type: string; payload: any }
): AppState => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appStateReducer, { data: null });

  const setData = (data: any) => {
    dispatch({ type: "SET_DATA", payload: data });
  };

  return (
    <AppStateContext.Provider value={{ state, setData }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextProps => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
