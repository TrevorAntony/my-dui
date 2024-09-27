import { useState, useEffect, useContext } from "react";
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
}: UseDataSetLogicProps) => {
  const { state, dispatch } = useContext(DashboardContext);
  const [modifiedQuery, setModifiedQuery] = useState<string>(query);
  const [queryReady, setQueryReady] = useState<boolean>(false);

  const requestData = {
    query: modifiedQuery,
    data_connection_id: config.dataConnection || "ANA",
    ...(filters && Object.keys(filters).length > 0 && { filters }),
    ...(searchText && { search_text: searchText }),
    ...(searchColumns && { search_columns: searchColumns }),
    ...(sortColumn && { sort_column: sortColumn }),
    ...(pageSize && { page_size: pageSize }),
    ...(currentPage && { current_page: currentPage }),
  };

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

  return { data, loading, error, state };
};

export default useDataSetLogic;
