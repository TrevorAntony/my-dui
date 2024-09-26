import React, { useState } from "react";
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
  transpose?: string;
  children: React.ReactNode;
}

const Dataset: React.FC<DataSetProps> = ({
  query: propQuery = "",
  staticData,
  useQuery,
  dataConnection,
  columnName,
  config,
  transpose = "false",
  children,
}) => {
  const initialQuery =
    config && columnName ? processQuery(propQuery, config) : propQuery;
  const [query, setQuery] = useState<string>(initialQuery);

  // Parse the string prop to a boolean
  const shouldTranspose = transpose === "true";

  // Use custom hook to fetch data
  const { data, loading, error, state } = useDataSetLogic(
    query,
    staticData,
    useQuery,
    dataConnection
  );

  let finalData = data;

  if (data && shouldTranspose) {
    if (data.length === 1) {
      finalData = transposeData(data);
    } else {
      console.error("Data cannot be transposed. More than one row found.");
      finalData = [];
    }
  }

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <DataProvider value={{ data: finalData, query, setQuery }}>
      {state?.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      {children}
    </DataProvider>
  );
};

export default Dataset;
