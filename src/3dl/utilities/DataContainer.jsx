import React, { useContext, useEffect } from "react";
import { DashboardContext } from "./Dashboard";

// DataContainer component that uses filters and renders visuals
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

  // Clone each child and pass the data as a prop
  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, { data }),
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
