import React, { useReducer, createContext, useContext } from "react";

// Define actions
const SET_FILTER = "SET_FILTER";
const SET_DATA = "SET_DATA";
const SET_DEBUG = "SET_DEBUG";
const SET_DESIGN_SYSTEM = "SET_DESIGN_SYSTEM";
const SET_THEME = "SET_THEME"; // Add action for setting theme

// Create a context for dashboard state
const DashboardContext = createContext();
const ThemeContext = createContext(); // Create a Theme context

// Reducer function to handle state updates
const dashboardReducer = (state, action) => {
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
    case SET_THEME: // Handle setting theme
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
};

// Dashboard component for managing state
const Dashboard = ({
  children,
  debug = false,
  designSystem = "plain",
  theme,
}) => {
  const [state, dispatch] = useReducer(dashboardReducer, {
    filters: {},
    data: {},
    debug,
    designSystem,
    theme, // Initialize theme state
  });

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </DashboardContext.Provider>
  );
};

// Utility function to set debug mode
const setDebugMode = (dispatch, value) => {
  dispatch({ type: SET_DEBUG, payload: value });
};

// Utility function to set design system
const setDesignSystem = (dispatch, value) => {
  dispatch({ type: SET_DESIGN_SYSTEM, payload: value });
};

// Utility function to set theme
const setTheme = (dispatch, value) => {
  dispatch({ type: SET_THEME, payload: value });
};

// Custom hooks to use the contexts
const useDashboardContext = () => useContext(DashboardContext);
const useThemeContext = () => useContext(ThemeContext); // Create a custom hook for the theme context

export default Dashboard;
export {
  DashboardContext,
  ThemeContext,
  setDebugMode,
  setDesignSystem,
  setTheme,
  useDashboardContext,
  useThemeContext,
};
