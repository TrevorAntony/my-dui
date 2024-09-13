import React, { createContext, useContext, useEffect, useState } from "react";
import useDataSetLogic from "./useDataSetLogic";

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

const DataSet = ({
  query = "",
  staticData,
  useQuery,
  children,
  dataConnection,
}) => {
  //Balancing the search and the pagination fetch logic
  // On search, we can reset the index and offset, so that we are fetching fresh data that has been filtered

  const [paginatedData, setPaginatedData] = useState([]);
  const pageSize = 15; // Fixed page size //to be a prop defined in the 3dl
  const [infiniteScrollConfig, setInfiniteScrollConfig] = useState({
    pageIndex: 1,
  });

  // Calculate the offset based on the pageIndex
  const offset = (infiniteScrollConfig.pageIndex - 1) * pageSize;

  // Replace placeholders in the query with actual values //add options for other other databases
  const paginatedQuery = query
    .replace("{pageSize}", pageSize)
    .replace("{offset}", offset);

  // Pass the modified query to useDataSetLogic
  const { data, loading, error, state } = useDataSetLogic(
    paginatedQuery,
    staticData,
    useQuery,
    dataConnection,
  );

  useEffect(() => {
    if (Array.isArray(data) && data?.length)
      setPaginatedData((paginatedData) => [...paginatedData, ...data]);
  }, [data]);

  //this was disabled to allow aesthetic for the infinite scroll behaviour, should resolve
  // if (loading) {
  //   return <div>Loading data...</div>;
  // }

  const updaterFunction = () => {
    setInfiniteScrollConfig((prevConfig) => ({
      ...prevConfig,
      pageIndex: prevConfig?.pageIndex + 1,
    }));
  };

  if (paginatedQuery.includes("OFFSET"))
    if (error) {
      return <div>Error fetching data: {error.message}</div>;
    }

  return (
    <DataContext.Provider value={{ data: paginatedData, updaterFunction }}>
      {/* Conditionally render Debug On if debug is true */}
      {state.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataContext.Provider>
  );
};

export default DataSet;
