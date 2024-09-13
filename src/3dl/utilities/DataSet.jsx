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
  pageSize = 15,
}) => {
  // Balancing the search and the pagination fetch logic
  // On search, we can reset the index and offset, so that we are fetching fresh data that has been filtered

  const [paginatedData, setPaginatedData] = useState([]);

  const { offset, nextPage } = useInfiniteScroll(pageSize);

  // Replace placeholders in the query with actual values
  const paginatedQuery = buildPaginatedQuery(query, pageSize, offset);

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

  // this was disabled to allow aesthetic for the infinite scroll behaviour, should resolve
  // if (loading) {
  //   return <div>Loading data...</div>;
  // }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <DataContext.Provider
      value={{ data: paginatedData, updaterFunction: nextPage }}
    >
      {/* Conditionally render Debug On if debug is true */}
      {state.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataContext.Provider>
  );
};

const buildPaginatedQuery = (query, pageSize, offset) => {
  return query.replace("{pageSize}", pageSize).replace("{offset}", offset);
};

const useInfiniteScroll = (pageSize) => {
  const [infiniteScrollConfig, setInfiniteScrollConfig] = useState({
    pageIndex: 1,
  });

  // Calculate the offset based on the pageIndex and pageSize
  const offset = (infiniteScrollConfig.pageIndex - 1) * pageSize;

  // Function to update the page index
  const nextPage = () => {
    setInfiniteScrollConfig((prevConfig) => ({
      ...prevConfig,
      pageIndex: prevConfig?.pageIndex + 1,
    }));
  };

  return { pageIndex: infiniteScrollConfig.pageIndex, offset, nextPage };
};

export default DataSet;
