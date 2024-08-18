import React, { useReducer, createContext, useContext } from 'react';

// Define actions
const SET_FILTER = 'SET_FILTER';
const SET_DATA = 'SET_DATA';
const SET_DEBUG = 'SET_DEBUG';
const SET_DESIGN_SYSTEM = 'SET_DESIGN_SYSTEM';

// Create a context for dashboard state
const DashboardContext = createContext();

// Reducer function to handle state updates
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case SET_FILTER:
      return {
        ...state,
        filters: { ...state.filters, [action.payload.name]: action.payload.value },
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
    default:
      return state;
  }
};

// Dashboard component for managing state
const Dashboard = ({ children, debug = false, designSystem = 'plain' }) => {
  const [state, dispatch] = useReducer(dashboardReducer, {
    filters: {},
    data: {},
    debug,
    designSystem,
  });

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
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

// Custom hook to use the Dashboard context
const useDashboardContext = () => useContext(DashboardContext);

export default Dashboard; // Add this line to make Dashboard a default export

export { DashboardContext, setDebugMode, setDesignSystem, useDashboardContext };