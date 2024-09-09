import React, { createContext, useContext } from "react";
import useDataSetLogic from "./useDataSetLogic";

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

const DataSet = ({ query = "", staticData, useQuery, children }) => {
  const { data, loading, error, state } = useDataSetLogic(
    query,
    staticData,
    useQuery,
  );

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

export default DataSet;
