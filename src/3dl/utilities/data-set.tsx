import React, { useState, useRef, useMemo, useCallback } from "react";
import { DataProvider } from "../context/DataContext";
import useDataSetLogic from "./useDataSetLogic";

interface DataSetProps {
  query?: string;
  staticData?: Array<Record<string, any>>;
  useQuery: boolean;
  dataConnection?: string;
  filters?: Record<string, any>;
  searchColumns?: string;
  sortColumn?: string;
  pageSize?: number;
  children: React.ReactNode;
}

const useSearch = (initialSearchText: string = "") => {
  const [searchText, setSearchText] = useState<string>(initialSearchText);

  const updateSearchText = useCallback((newSearchText: string) => {
    setSearchText(newSearchText);
  }, []);

  return { searchText, updateSearchText };
};

const Dataset: React.FC<DataSetProps> = ({
  query: propQuery = "",
  staticData,
  useQuery,
  filters = {},
  searchColumns,
  sortColumn,
  pageSize,
  children,
}) => {
  const [query, setQuery] = useState<string>(propQuery);
  const [currentPage, updatePage, resetPage] = useCurrentPage(1);
  const [paginatedData, setPaginatedData] = useState<
    Array<Record<string, any>>
  >([]);
  const { searchText, updateSearchText } = useSearch();

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

  const prevSearchTextRef = useRef<string>(searchText);

  const updatePaginatedData = useCallback(() => {
    const shouldResetPaginatedData = searchText !== prevSearchTextRef.current;
    prevSearchTextRef.current = searchText;

    if (shouldResetPaginatedData) {
      setPaginatedData(data);
    } else if (currentPage > 1 && pageSize) {
      console.log({ data });
      setPaginatedData((prevData) => [...(prevData || []), ...(data || [])]);
    } else {
      setPaginatedData(data);
    }
  }, [data, currentPage, pageSize, searchText]);

  useMemo(() => {
    updatePaginatedData();
  }, [updatePaginatedData]);

  const handleSearchChange = useCallback((newSearchText: string) => {
    resetPage();
    updateSearchText(newSearchText);
  }, []);

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
        loading,
        handleSearchChange,
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

  const updatePage = useCallback((): void => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  const resetPage = useCallback((): void => {
    setCurrentPage(1);
  }, []);

  return [currentPage, updatePage, resetPage];
};

export default Dataset;
