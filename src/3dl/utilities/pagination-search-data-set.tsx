import React, { useEffect, useState } from "react";
import { DataProvider } from "../context/DataContext"; // Import the DataProvider from shared context
import useDataSetLogic from "./useDataSetLogic";
import { useInfiniteScroll, useSearchText, buildQuery } from "./helpers";

interface DataSetProps {
  query?: string;
  staticData?: any;
  useQuery: any;
  children?: React.ReactNode;
  dataConnection?: string;
  pageSize?: number;
}

const PaginatedSearchDataSet: React.FC<DataSetProps> = ({
  query = "",
  staticData,
  useQuery,
  children,
  dataConnection,
  pageSize = 15,
}) => {
  const [paginatedData, setPaginatedData] = useState<any[]>([]);

  const { offset, nextPage } = useInfiniteScroll(pageSize);
  const { searchText, handleSearchChange } = useSearchText();

  const { modifiedQuery, searchModification } = buildQuery(
    query,
    pageSize,
    offset,
    searchText
  );

  const { data, error, state } = useDataSetLogic(
    modifiedQuery,
    staticData,
    useQuery,
    dataConnection
  );

  useEffect(() => {
    if (Array.isArray(data)) {
      if (searchModification) {
        setPaginatedData(data); // Handle search results
      } else if (data?.length) {
        setPaginatedData((prevData) => [...prevData, ...data]); // Handle pagination
      }
    }
  }, [data, searchModification]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  // Wrap children inside DataProvider to pass down data and other props via context
  return (
    <DataProvider
      value={{ data: paginatedData, pageUpdater: nextPage, handleSearchChange }}
    >
      {state.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataProvider>
  );
};

export default PaginatedSearchDataSet;
