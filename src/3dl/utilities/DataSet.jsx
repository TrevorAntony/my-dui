import React, { createContext, useContext, useEffect, useState } from "react";
import useDataSetLogic from "./useDataSetLogic";
import { useInfiniteScroll, useSearchText, buildQuery } from "./helpers";

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
  const [paginatedData, setPaginatedData] = useState([]);

  const { offset, nextPage } = useInfiniteScroll(pageSize);

  const { searchText, handleSearchChange } = useSearchText();

  const { modifiedQuery, searchModification } = buildQuery(
    query,
    pageSize,
    offset,
    searchText,
  );

  const { data, loading, error, state } = useDataSetLogic(
    modifiedQuery,
    staticData,
    useQuery,
    dataConnection,
  );

  useEffect(() => {
    if (Array.isArray(data)) {
      if (searchModification) {
        setPaginatedData(data); //no empty checks cause the returned search could be empty
      } else if (data?.length) {
        setPaginatedData((prevData) => [...prevData, ...data]);
      }
    }
  }, [data]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  // this was disabled to allow aesthetic for the infinite scroll behaviour
  // if (loading) {
  //   return <div>Loading data...</div>;
  // }

  return (
    <DataContext.Provider
      value={{ data: paginatedData, pageUpdater: nextPage, handleSearchChange }}
    >
      {state.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataContext.Provider>
  );
};

export default DataSet;
