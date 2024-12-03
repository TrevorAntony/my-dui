/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useMemo, useCallback } from "react";
import { DataProvider } from "../context/DataContext";
import useDataSetLogic from "./useDataSetLogic";
import { processQuery, transposeData } from "../../helpers/visual-helpers";

interface DuftQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface DataSetProps {
  query?: string;
  staticData?: Array<Record<string, any>>;
  useQuery: <T>(requestPayload: any) => DuftQueryResult<T>;
  filters?: Record<string, any>;
  searchColumns?: string;
  sortColumn?: string;
  pageSize?: number;
  dataConnection?: string;
  columnName?: string;
  config?: { [key: string]: string };
  transpose?: string;
  debug?: string | boolean;
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
    [delay],
  );

  return { searchText, updateSearchText };
};

const useSort = (initialSortText: string = "") => {
  const [sortText, setSortText] = useState<string>(initialSortText);

  const updateSortText = useCallback((newSortText: string) => {
    setSortText(newSortText);
  }, []);

  return { sortText, updateSortText };
};

const Dataset: React.FC<DataSetProps> = ({
  query: propQuery = "",
  staticData,
  useQuery,
  filters = {},
  searchColumns,
  pageSize,
  columnName,
  config,
  transpose = "false",
  debug,
  children,
}) => {
  const initialQuery =
    config && columnName ? processQuery(propQuery, config) : propQuery;
  const [query, setQuery] = useState<string>(initialQuery);

  const [currentPage, updatePage, resetPage] = useCurrentPage(1);
  const [paginatedData, setPaginatedData] = useState<
    Array<Record<string, any>>
  >([]);
  const { searchText, updateSearchText } = useSearch();
  const { sortText, updateSortText } = useSort();

  const shouldTranspose = transpose === "true";

  const { data, loading, error } = useDataSetLogic({
    query,
    staticData,
    useQuery,
    filters,
    searchText,
    searchColumns,
    sortColumn: sortText,
    pageSize,
    currentPage,
    debug,
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
    [resetPage, updateSearchText],
  );

  const handleSortChange = useCallback(
    (newSortText: string) => {
      resetPage();
      updateSortText(newSortText);
    },
    [resetPage, updateSortText],
  );

  let finalData = paginatedData;

  if (paginatedData && shouldTranspose) {
    if (paginatedData.length === 1) {
      finalData = transposeData(data);
    } else {
      console.error("Data cannot be transposed. More than one row found.");
      finalData = [];
    }
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <DataProvider
      value={{
        data: finalData,
        query,
        setQuery,
        resetPage,
        pageUpdater: updatePage,
        loading,
        handleSearchChange,
        handleSortChange,
        searchColumns,
        pageSize,
      }}
    >
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
