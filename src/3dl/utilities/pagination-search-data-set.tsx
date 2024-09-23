import React, { useEffect, useRef, useState } from "react";
import { DataProvider } from "../context/DataContext";
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
  const previousSearchText = useRef<string>("");

  const { offset, nextPage, resetPage } = useInfiniteScroll(pageSize);
  const { searchText, handleSearchChange } = useSearchText(resetPage);

  const { modifiedQuery, searchModifier } = buildQuery(
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
    if (!Array.isArray(data)) return;

    if (searchModifier) {
      if (previousSearchText.current !== searchText) {
        setPaginatedData(data);
        previousSearchText.current = searchText;
      } else {
        setPaginatedData((prevData) => [...prevData, ...data]);
      }
    } else {
      setPaginatedData((prevData) => [...prevData, ...data]);
    }
  }, [searchModifier, data]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

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
