import React, { useState, useEffect } from "react";
import { DataProvider } from "../context/DataContext";
import useDataSetLogic from "./useDataSetLogic";
import { processQuery, transposeData } from "../../helpers/visual-helpers";

interface DataSetProps {
  query?: string;
  staticData?: any;
  useQuery: boolean;
  dataConnection?: any;
  columnName?: string;
  config?: { [key: string]: string };
  children: React.ReactNode;
}

const Dataset: React.FC<DataSetProps> = ({
  query: propQuery = "",
  staticData,
  useQuery,
  dataConnection,
  columnName,
  config,
  children,
}) => {
  const [query, setQuery] = useState<string>(propQuery);
  const [processedData, setProcessedData] = useState<any[]>([]);

  const { data, loading, error, state } = useDataSetLogic(
    query,
    staticData,
    useQuery,
    dataConnection
  );

  useEffect(() => {
    if (columnName && config) {
      const newQuery = processQuery(propQuery, config);
      const transposedData = data ? transposeData(data) : [];

      setQuery(newQuery);
      setProcessedData(transposedData);
    } else {
      setQuery(propQuery);
      setProcessedData(data || []);
    }
  }, [columnName, config, propQuery, data]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const updatedData = processedData.length > 0 ? processedData : data || [];

  return (
    <DataProvider value={{ data: updatedData, query, setQuery }}>
      {state?.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataProvider>
  );
};

export default Dataset;
