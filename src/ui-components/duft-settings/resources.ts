import { useState, useEffect } from "react";
import config from "../../config";
import { useAuth } from "../../context/AuthContext";

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
  const { accessToken, logout } = useAuth();

  useEffect(() => {
    const fetchDataConnections = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/data-connections`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401) {
          logout();
          throw new Error("Session expired. Please log in again.");
        }

        const data: DataConnectionsResponse = await response.json();
        setDataConnections(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (accessToken) {
      fetchDataConnections();
    }
  }, [accessToken, logout]);

  return dataConnections;
};
