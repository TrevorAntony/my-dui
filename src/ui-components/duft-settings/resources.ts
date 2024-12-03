import { useState, useEffect } from "react";
import { client } from "../../index";

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

export interface DataConnectionsResponse {
  system: Connection[];
  user: Connection[];
}

export interface DataConnectionFormProps {
  connection: Connection;
  handleConnectionClick: (connection?: Connection) => void;
}

export const isValidArray = (array) => {
  return Array.isArray(array) && array?.length > 0;
};

export const useDataConnections = () => {
  const [dataConnections, setDataConnections] =
    useState<DataConnectionsResponse | null>(null);

  useEffect(() => {
    const fetchDataConnections = async () => {
      try {
        const data = await client.getDataConnections();
        setDataConnections(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataConnections();
  }, []);

  return dataConnections;
};
