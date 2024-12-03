/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Reducer } from "react";
import React, { useReducer, createContext, useContext } from "react";
import type { DashboardState } from "../../types/dashboard";
interface DashboardAction {
  type: string;
  payload: any;
}

const SET_FILTER = "SET_FILTER";
const SET_DATA = "SET_DATA";
const SET_DEBUG = "SET_DEBUG";
const SET_DESIGN_SYSTEM = "SET_DESIGN_SYSTEM";
const SET_THEME = "SET_THEME";

const DashboardContext = createContext<
  | { state: DashboardState; dispatch: React.Dispatch<DashboardAction> }
  | undefined
>(undefined);

interface Theme {
  [key: string]: any;
}

const ThemeContext = createContext<Theme>({});
const LayoutContext = createContext("");

const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction,
): DashboardState => {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.name]: action.payload.value,
        },
      };
    case SET_DATA:
      return {
        ...state,
        data: { ...state.data, [action.payload.key]: action.payload.data },
      };
    case SET_DEBUG:
      return {
        ...state,
        debug: action.payload,
      };
    case SET_DESIGN_SYSTEM:
      return {
        ...state,
        designSystem: action.payload,
      };
    case SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

// Update the Dashboard component props interface
interface DashboardProps {
  children?: React.ReactNode;
  debug?: boolean;
  designSystem?: string;
  theme?: Record<string, unknown>;
  layout?: string;
}

const Dashboard = ({
  children,
  debug = false,
  designSystem = "plain",
  theme,
  layout = "grid",
}: DashboardProps) => {
  const [state, dispatch] = useReducer<
    Reducer<DashboardState, DashboardAction>
  >(dashboardReducer, {
    filters: {} as Record<string, string>,
    data: {} as Record<string, string[]>,
    debug,
    designSystem,
    theme,
    layout,
  });

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      <LayoutContext.Provider value={layout}>
        <ThemeContext.Provider value={theme || {}}>
          {children}
        </ThemeContext.Provider>
      </LayoutContext.Provider>
    </DashboardContext.Provider>
  );
};

// Create a type for dispatch and its payload
type DashboardDispatch = (action: DashboardAction) => void;

// Update the utility functions to use the new type
const setFilter = (
  dispatch: DashboardDispatch,
  name: string,
  value: string,
) => {
  dispatch({ type: SET_FILTER, payload: { name, value } });
};

const setDebugMode = (dispatch: DashboardDispatch, value: any) => {
  dispatch({ type: SET_DEBUG, payload: value });
};

const setDesignSystem = (dispatch: DashboardDispatch, value: any) => {
  dispatch({ type: SET_DESIGN_SYSTEM, payload: value });
};

const setTheme = (dispatch: DashboardDispatch, value: any) => {
  dispatch({ type: SET_THEME, payload: value });
};

// Custom hook to use the Dashboard context
const useDashboardContext = () => useContext(DashboardContext);
const useThemeContext = () => useContext(ThemeContext);
const useLayout = () => useContext(LayoutContext);

export default Dashboard;
export {
  DashboardContext,
  ThemeContext,
  setDebugMode,
  setDesignSystem,
  setTheme,
  setFilter,
  useDashboardContext,
  useThemeContext,
  useLayout,
};
