import { useState, useEffect, useContext, useMemo } from "react";
import { DashboardContext } from "./Dashboard";
import config from "../../config";

interface UseDataSetLogicProps {
  query: string;
  staticData?: any;
  useQuery: any;
  filters?: Record<string, any>;
  searchText?: string;
  searchColumns?: string;
  sortColumn?: string;
  pageSize?: number;
  currentPage?: number;
  debug?: string | boolean;
}

const useDataSetLogic = ({
  query,
  staticData,
  useQuery,
  filters = {},
  searchText,
  searchColumns,
  sortColumn,
  pageSize,
  currentPage,
  debug = false,
}: UseDataSetLogicProps) => {
  const { state, dispatch } = useContext(DashboardContext);
  const [modifiedQuery, setModifiedQuery] = useState<string>(query);
  const [queryReady, setQueryReady] = useState<boolean>(false);

  const requestData = useMemo(
    () => ({
      query: modifiedQuery,
      data_connection_id: config.dataConnection || "ANA",
      ...(filters && Object.keys(filters).length > 0 && { filters }),
      ...(searchText && { search_text: searchText }),
      ...(searchColumns && { search_columns: searchColumns }),
      ...(sortColumn && { sort_column: sortColumn }),
      ...(pageSize && { page_size: pageSize }),
      ...(currentPage && { current_page: currentPage }),
    }),
    [
      modifiedQuery,
      filters,
      searchText,
      searchColumns,
      sortColumn,
      pageSize,
      currentPage,
    ]
  );

  const {
    data: fetchedData,
    isLoading: loading,
    error,
  } = useQuery(queryReady ? requestData : null);

  const data = staticData || fetchedData;

  useEffect(() => {
    if (query) {
      let tempQuery = query;
      const stateFilters = state.filters || {};

      const placeholders = query.match(/\$[a-zA-Z_]+/g) || [];
      placeholders.forEach((placeholder) => {
        const filterKey = placeholder.substring(1);
        const filterValue = filters[filterKey] || stateFilters[filterKey] || "";
        tempQuery = tempQuery.replace(placeholder, filterValue);
      });

      setModifiedQuery(tempQuery);
      setQueryReady(true);
    }
  }, [query, filters, state.filters]);

  useEffect(() => {
    if (queryReady && !loading && !error) {
      dispatch({
        type: "SET_DATA",
        payload: { key: query, data: fetchedData },
      });
    }
  }, [staticData, fetchedData, loading, error, dispatch, query, queryReady]);

  useEffect(() => {
    const fetchData = async () => {
      if (debug === true || debug === "true") {
        try {
          const response = await fetch(`${config.apiBaseUrl}/build-query`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Debug - /build-query response:", data);
        } catch (error) {
          console.error("Debug - Error fetching /build-query:", error);
        }
      }
    };

    fetchData();
  }, [
    query,
    filters,
    searchText,
    searchColumns,
    sortColumn,
    currentPage,
    pageSize,
    debug,
    requestData,
  ]);

  return { data, loading, error, state };
};

export default useDataSetLogic;
