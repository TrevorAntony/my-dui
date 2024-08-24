import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "./Dashboard";

// DataContainer component that uses filters and renders visuals
const DataContainer = ({ query = "", staticData, useQuery, children }) => {
  const { state, dispatch } = useContext(DashboardContext);
  const [modifiedQuery, setModifiedQuery] = useState(query);
  const { data: fetchedData, loading, error } = useQuery(modifiedQuery);

  const data = staticData || fetchedData;

  useEffect(() => {
    if (query) {
      // Logic to replace $placeholders with actual filter values or appropriate SQL clauses
      let tempQuery = query;
      const filters = state.filters || {};

      // Use a regular expression to find all $placeholders in the query
      const placeholders = query.match(/\$[a-zA-Z_]+/g) || [];

      placeholders.forEach((placeholder) => {
        const filterKey = placeholder.substring(1); // Remove the $ symbol to get the filter key
        const filterValue = filters[filterKey] || '';

        // Replace the placeholder with the actual filter value or an empty string
        tempQuery = tempQuery.replace(placeholder, filterValue ? `${filterValue}` : ``);
      });

      setModifiedQuery(tempQuery);
      console.log(tempQuery);
    }

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
  }, [staticData, fetchedData, loading, error, dispatch, query, state.filters]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  // Clone each child and pass the data as a prop
  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, { data })
  );

  return (
    <>
      {/* Conditionally render Debug On if debug is true */}

      {state.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {childrenWithProps}
    </>
  );
};

export default DataContainer;