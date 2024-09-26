import React, { useState } from "react";
import { DataProvider } from "../context/DataContext";
import useDataSetLogic from "./useDataSetLogic";
import { processQuery } from "../../helpers/visual-helpers";

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
  const initialQuery =
    config && columnName ? processQuery(propQuery, config) : propQuery;
  const [query, setQuery] = useState<string>(initialQuery);

  // Use custom hook to fetch data
  const { data, loading, error, state } = useDataSetLogic(
    query,
    staticData,
    useQuery,
    dataConnection
  );

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <DataProvider value={{ data, query, setQuery }}>
      {state?.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataProvider>
  );
};

export default Dataset;
