/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useDatasetContext } from "./Dataset2";
import useDataSetLogic from "./useDataSetLogic";
import { processQuery } from "../../helpers/visual-helpers";
import { useDetailsViewContext } from "./details-view-context";
import { DuftHttpClient } from "../../api/DuftHttpClient/DuftHttpClient";

interface DuftQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface DataSetProps {
  useQuery: <T>(requestPayload: any) => DuftQueryResult<T>;
  filters?: Record<string, any>;
  searchColumns?: string;
  pageSize?: number;
  debug?: string | boolean;
  children: string;
  client?: DuftHttpClient;
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

const useSort = (initialSortText: string = "") => {
  const [sortText, setSortText] = useState<string>(initialSortText);

  const updateSortText = useCallback((newSortText: string) => {
    setSortText(newSortText);
  }, []);

  return { sortText, updateSortText };
};

const QueryDataset: React.FC<DataSetProps> = ({
  children: queryAsChild,
  useQuery,
  filters = {},
  searchColumns,
  pageSize,
  debug,
  client,
}) => {
  const { setData } = useDatasetContext();
  const detailsContext = useDetailsViewContext();
  const { columnName, config } = detailsContext || {};

  const initialQuery =
    config && columnName ? processQuery(queryAsChild, config) : queryAsChild;
  const [query, setQuery] = useState<string>(initialQuery);

  const [currentPage, updatePage, resetPage] = useCurrentPage(1);
  const [paginatedData, setPaginatedData] = useState<
    Array<Record<string, any>>
  >([]);
  const { searchText, updateSearchText } = useSearch();
  const { sortText, updateSortText } = useSort();

  const { data, loading, error } = useDataSetLogic({
    query,
    useQuery,
    filters,
    searchText,
    searchColumns,
    sortColumn: sortText,
    pageSize,
    currentPage,
    debug,
    client,
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

  const handleSortChange = useCallback(
    (newSortText: string) => {
      resetPage();
      updateSortText(newSortText);
    },
    [resetPage, updateSortText]
  );

  let finalData = paginatedData;

  useEffect(() => {
    setData({
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
    });
  }, [
    finalData,
    query,
    setQuery,
    resetPage,
    updatePage,
    loading,
    handleSearchChange,
    handleSortChange,
    searchColumns,
    pageSize,
    setData,
  ]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return null; // Query component doesn't render anything
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

export default QueryDataset;
