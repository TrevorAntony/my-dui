import React, { useEffect } from "react";
import useDataSetLogic from "./useDataSetLogic";
import { DuftHttpClient } from "../../api/DuftHttpClient/DuftHttpClient";
import { useDataContext, DatasetParams } from "../context/DataContext";

interface DuftQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface ServerQueryDataProps {
  useQuery: <T>(requestPayload: any) => DuftQueryResult<T>;
  filters?: Record<string, any>;
  queryName: string;
  client?: DuftHttpClient;
  children?: any;
}

const ServerQueryData: React.FC<ServerQueryDataProps> = ({
  queryName,
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

  const { data, loading, error } = useDataSetLogic({
    queryName,
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

  useEffect(() => {
    setDatasetParams((prev: DatasetParams) => ({
      ...prev,
      loading,
      error,
      queryName,
    }));
  }, [loading, error, queryName, setDatasetParams]);

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

export default ServerQueryData;
