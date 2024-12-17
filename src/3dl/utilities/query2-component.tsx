import React, { useState, useEffect } from "react";
import { DatasetParams, useDatasetContext } from "./Dataset2";
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

const QueryDataset: React.FC<DataSetProps> = ({
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
  } = useDatasetContext();
  const detailsContext = useDetailsViewContext();
  const { columnName, config } = detailsContext || {};

  const queryString = extractQueryString(queryAsChild as string | QueryObject);
  const initialQuery =
    config && columnName ? processQuery(queryString, config) : queryString;

  const [query] = useState<string>(initialQuery);

  const { data, loading, error } = useDataSetLogic({
    query,
    useQuery,
    filters,
    searchText,
    searchColumns,
    sortColumn,
    pageSize,
    currentPage,
    debug,
    client,
  });

  // First effect for params updates
  useEffect(() => {
    setDatasetParams((prev: DatasetParams) => ({
      ...prev,
      loading,
      error,
      query,
    }));
  }, [loading, error, query, setDatasetParams]);

  // Second effect for data updates
  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data, setData]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return null;
};

export default QueryDataset;
