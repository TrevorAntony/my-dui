import React, { createContext, useContext, useState } from "react";

interface DatasetContextType {
  data: any[] | null;
  query: string;
  setData: (data: any) => void;
  setQuery: (query: string) => void;
  resetPage: () => void;
  pageUpdater: () => void;
  loading: boolean;
  handleSearchChange: (searchText: string) => void;
  handleSortChange: (sortText: string) => void;
  searchColumns?: string;
  pageSize?: number;
  searchText?: string;
}

const defaultContext: DatasetContextType = {
  data: null,
  query: "",
  setData: () => {},
  setQuery: () => {},
  resetPage: () => {},
  pageUpdater: () => {},
  loading: false,
  handleSearchChange: () => {},
  handleSortChange: () => {},
  searchColumns: undefined,
  pageSize: undefined,
  searchText: undefined,
};

const DatasetContext = createContext<DatasetContextType>(defaultContext);

const Dataset2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<null | DatasetContextType>(null);

  return (
    <DatasetContext.Provider value={{ ...data, setData }}>
      {children}
    </DatasetContext.Provider>
  );
};

export const useDatasetContext = () => useContext(DatasetContext);

export default Dataset2;
