import React, { createContext, useContext, useEffect } from "react";
import { DashboardContext } from "./Dashboard";

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

const DataContainer = ({ query, staticData, useQuery, children }) => {
  const { state, dispatch } = useContext(DashboardContext);
  const { data: fetchedData, loading, error } = useQuery(query);

  const data = staticData || fetchedData;

  useEffect(() => {
    if (staticData) {
      dispatch({
        type: "SET_DATA",
        payload: { key: query || "static", data: staticData },
      });
    } else if (!loading && !error) {
      dispatch({
        type: "SET_DATA",
        payload: { key: query, data: fetchedData },
      });
    }
  }, [staticData, fetchedData, loading, error, dispatch, query]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <DataContext.Provider value={data}>
      {/* Conditionally render Debug On if debug is true */}
      {state.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataContext.Provider>
  );
};

export default DataContainer;
