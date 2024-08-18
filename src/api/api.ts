// src/api/api.ts
import config from "../config";

export const fetchDataAndStore = async (
  endpoint: string,
  setData: (data: any) => void
): Promise<void> => {
  try {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`);
    const result = await response.json();
    setData(result);
  } catch (error) {
    console.error("Failed to fetch and store data", error);
  }
};

export const fetchDataWithoutStore = async (endpoint: string): Promise<any> => {
  try {
    const response = await fetch(`${config.apiBaseUrl}${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch data", error);
    throw error;
  }
};
