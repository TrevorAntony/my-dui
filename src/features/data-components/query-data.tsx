import React, { useState, useEffect, useMemo } from "react";
import useDataSetLogic from "./hooks/useDataSetLogic";
import { processQuery } from "../../../utils/visual-helpers";
import { useDetailsViewContext } from "../../../visualizations/visual-utils/details-view/details-view-context";
import { DuftHttpClient } from "../../api/DuftHttpClient/DuftHttpClient";
import { useDataContext, DatasetParams } from "../../context/DataContext";

interface DuftQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface DataSetProps {
  useQuery: <T>(requestPayload: any) => DuftQueryResult<T>;
  filters?: Record<string, any>;
  children: string;
  client?: DuftHttpClient;
}

interface QueryObject {
  key: string;
  ref: null;
  props: {
    children: string;
  };
  _owner: null;
  _store: Record<string, unknown>;
}

const extractQueryString = (queryInput: string | QueryObject): string => {
  if (typeof queryInput === "string") {
    return queryInput;
  }
  return queryInput?.props?.children.trim();
};

const QueryData: React.FC<DataSetProps> = ({
  children: queryAsChild,
  useQuery,
  filters = {},
  client,
}) => {
  const {
    setData,
    setDatasetParams,
    datasetParams: {
      searchText,
      searchColumns,
      sortColumn,
      currentPage,
      pageSize,
      debug,
    },
  } = useDataContext();
  const detailsContext = useDetailsViewContext();
  const { columnName, config } = detailsContext || {};

  const processedQueryString = useMemo(() => {
    const queryString = extractQueryString(
      queryAsChild as string | QueryObject
    );
    return config && columnName
      ? processQuery(queryString, config)
      : queryString;
  }, [queryAsChild, config, columnName]);

  const [query, setQuery] = useState<string>(processedQueryString);

  const { data, loading, error } = useDataSetLogic({
    query,
    useQuery,
    filters,
    searchText,
    searchColumns,
    sortColumn,
    pageSize: typeof pageSize === "string" ? parseInt(pageSize, 10) : pageSize,
    currentPage,
    debug,
    client,
  });

  useEffect(() => {
    setDatasetParams((prev: DatasetParams) => ({
      ...prev,
      loading,
      error,
      query,
      setQuery,
    }));
  }, [loading, error, query, setQuery, setDatasetParams]);

  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return null;
};

export default QueryData;
