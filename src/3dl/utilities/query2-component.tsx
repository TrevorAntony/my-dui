import React, { useState, useEffect } from "react";
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
  children: string;
  client?: DuftHttpClient;
}

const QueryDataset: React.FC<DataSetProps> = ({
  children: queryAsChild,
  useQuery,
  filters = {},
  client,
}) => {
  const { setData } = useDatasetContext();
  const detailsContext = useDetailsViewContext();
  const { columnName, config } = detailsContext || {};

  const initialQuery =
    config && columnName ? processQuery(queryAsChild, config) : queryAsChild;
  const [query] = useState<string>(initialQuery);

  const { data, error } = useDataSetLogic({
    query,
    useQuery,
    filters,
    client,
  });

  useEffect(() => {
    if (data) {
      console.log("data reveived");
      setData(data);
    }
  }, [data, setData]);

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return null;
};

export default QueryDataset;
