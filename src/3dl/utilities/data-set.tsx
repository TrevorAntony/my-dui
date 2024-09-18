import React from "react";
import { useQueryContext } from "../context/QueryContext"; // Import the QueryContext
import { DataProvider } from "../context/DataContext";
import useDataSetLogic from "./useDataSetLogic";

interface DataSetProps {
  query?: string;
  staticData?: any;
  useQuery: boolean;
  dataConnection?: any;
  children: React.ReactNode;
}

const DataSet: React.FC<DataSetProps> = ({
  query: propQuery = "",
  staticData,
  useQuery,
  dataConnection,
  children,
}) => {
  const { query: contextQuery } = useQueryContext();
  const queryToUse = contextQuery || propQuery;

  const { data, loading, error, state } = useDataSetLogic(
    queryToUse,
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
      {state?.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataProvider>
  );
};

export default DataSet;
