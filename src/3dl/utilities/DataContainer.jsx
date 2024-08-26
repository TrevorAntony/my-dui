import React, { createContext, useContext, useEffect, useState } from "react";
import { DashboardContext } from "./Dashboard";

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

// DataContainer component that uses filters and renders visuals
const DataContainer = ({ query = "", staticData, useQuery, children }) => {
  const { state, dispatch } = useContext(DashboardContext);
  const [modifiedQuery, setModifiedQuery] = useState("");
  const [queryReady, setQueryReady] = useState(false);
  const {
    data: fetchedData,
    loading,
    error,
  } = useQuery(queryReady ? modifiedQuery : null);

  const data = staticData || fetchedData;

  useEffect(() => {
    if (query) {
      let tempQuery = query;
      const filters = state.filters || {};

      // Find all $placeholders in the query
      const placeholders = query.match(/\$[a-zA-Z_]+/g) || [];

      // Check if all placeholders have corresponding filters
      const allFiltersExist = placeholders.every((placeholder) => {
        const filterKey = placeholder.substring(1); // Remove the $ symbol to get the filter key
        return filters.hasOwnProperty(filterKey);
      });

      if (!allFiltersExist) {
        console.log("Aborting query execution due to missing filters.");
        setQueryReady(false); // Ensure query is not executed
        return;
      }

      // Replace placeholders with actual filter values
      placeholders.forEach((placeholder) => {
        const filterKey = placeholder.substring(1);
        const filterValue = filters[filterKey] || "";
        tempQuery = tempQuery.replace(
          placeholder,
          filterValue ? `${filterValue}` : ``,
        );
      });

      setModifiedQuery(tempQuery);
      console.log("Temp query: ", tempQuery);
      setQueryReady(true); // Allow query execution
    }
  }, [query, state.filters]);

  useEffect(() => {
    if (queryReady && !loading && !error) {
      console.log("Data: ", data);
      dispatch({
        type: "SET_DATA",
        payload: { key: query, data: fetchedData },
      });
    }
  }, [staticData, fetchedData, loading, error, dispatch, query, queryReady]);

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
