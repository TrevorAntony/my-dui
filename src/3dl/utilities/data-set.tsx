import React, { useState, useRef, useMemo, useCallback } from "react";
import { DataProvider } from "../context/DataContext";
import useDataSetLogic from "./useDataSetLogic";
import { processQuery } from "../../helpers/visual-helpers";

interface DataSetProps {
  query?: string;
  staticData?: Array<Record<string, any>>;
  useQuery: boolean;
  filters?: Record<string, any>;
  searchColumns?: string;
  sortColumn?: string;
  pageSize?: number;
  dataConnection?: string;
  columnName?: string;
  config?: { [key: string]: string };
  children: React.ReactNode;
}

const useSearch = (initialSearchText: string = "", delay: number = 500) => {
  const [searchText, setSearchText] = useState<string>(initialSearchText);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateSearchText = useCallback(
    (newSearchText: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        setSearchText(newSearchText);
      }, delay);
    },
    [delay]
  );

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
  columnName,
  config,
}) => {
  const initialQuery =
    config && columnName ? processQuery(propQuery, config) : propQuery;
  const [query, setQuery] = useState<string>(initialQuery);

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
      setPaginatedData((prevData) => [...(prevData || []), ...(data || [])]);
    } else {
      setPaginatedData(data);
    }
  }, [data, currentPage, pageSize, searchText]);

  useMemo(() => {
    updatePaginatedData();
  }, [updatePaginatedData]);

  const handleSearchChange = useCallback(
    (newSearchText: string) => {
      resetPage();
      updateSearchText(newSearchText);
    },
    [resetPage, updateSearchText]
  );

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
