import type { ReactNode } from "react";
import React from "react";
import { DataProvider } from "../context/DataContext";
import useDataSetLogic from "./useDataSetLogic";

interface DataSetProps {
  query?: string;
  staticData?: any;
  useQuery: boolean;
  dataConnection?: any;
  children: ReactNode;
}

const DataSet: React.FC<DataSetProps> = ({
  query = "",
  staticData,
  useQuery,
  dataConnection,
  children,
}) => {
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
    <DataProvider value={{ data }}>
      {/* Conditionally render Debug On if debug is true */}
      {state?.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataProvider>
  );
};

export default DataSet;
