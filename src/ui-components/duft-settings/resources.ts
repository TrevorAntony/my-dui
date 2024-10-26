import { useState, useEffect } from "react";
import config from "../../config";

interface Param {
  name: string;
  type: string;
  label: string;
}

export interface Connection {
  id: string;
  name: string;
  description: string;
  allowQueryEngine?: string;
  params: Param[];
}

interface DataConnectionsResponse {
  system: Connection[];
  user: Connection[];
}

export interface DataConnectionFormProps {
  connection: Connection;
}

export const useDataConnections = () => {
  const [dataConnections, setDataConnections] =
    useState<DataConnectionsResponse | null>(null);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/data-connections`)
      .then((response) => response.json())
      .then((data: DataConnectionsResponse) => setDataConnections(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return dataConnections;
};
