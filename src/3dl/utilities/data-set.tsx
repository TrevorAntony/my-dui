import React, { useState, useRef, useMemo } from "react";
import { DataProvider } from "../context/DataContext";
import useDataSetLogic from "./useDataSetLogic";

interface DataSetProps {
  query?: string;
  staticData?: Array<Record<string, any>>;
  useQuery: boolean;
  dataConnection?: string;
  filters?: Record<string, any>;
  searchText?: string;
  searchColumns?: string;
  sortColumn?: string;
  pageSize?: number;
  children: React.ReactNode;
}

const usePaginatedData = (
  data: Array<Record<string, any>>,
  currentPage: number,
  pageSize: number | undefined,
  searchText: string | undefined
) => {
  const prevSearchTextRef = useRef<string | undefined>(searchText);

  return useMemo(() => {
    const shouldResetPaginatedData = searchText !== prevSearchTextRef.current;
    prevSearchTextRef.current = searchText;

    if (shouldResetPaginatedData) {
      return data;
    } else if (currentPage && pageSize) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return data?.slice(0, endIndex);
    } else {
      return data;
    }
  }, [data, currentPage, pageSize, searchText]);
};

const Dataset: React.FC<DataSetProps> = ({
  query: propQuery = "",
  staticData,
  useQuery,
  filters = {},
  searchText,
  searchColumns,
  sortColumn,
  pageSize,
  children,
}) => {
  const [query, setQuery] = useState<string>(propQuery);
  const [currentPage, updatePage, resetPage] = useCurrentPage(1);

  const { data, loading, error, state } = useDataSetLogic({
    query,
    staticData,
    useQuery,
    filters,
    searchText,
    searchColumns,
    sortColumn,
    pageSize,
    currentPage,
  });

  const paginatedData = usePaginatedData(
    data,
    currentPage,
    pageSize,
    searchText
  );

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <DataProvider
      value={{
        data: paginatedData,
        query,
        setQuery,
        resetPage,
        pageUpdater: updatePage,
      }}
    >
      {state?.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataProvider>
  );
};

type UseCurrentPageHook = [number, () => void, () => void];

const useCurrentPage = (initialPage: number): UseCurrentPageHook => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const updatePage = (): void => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const resetPage = (): void => {
    setCurrentPage(1);
  };

  return [currentPage, updatePage, resetPage];
};

export default Dataset;
