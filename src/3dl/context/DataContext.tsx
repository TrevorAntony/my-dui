import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";

export interface DatasetParams {
  filters: any;
  searchText?: string;
  searchColumns?: string;
  sortColumn?: string;
  pageSize?: string | number;
  currentPage?: number;
  debug: boolean;
  appendData: boolean;
  loading?: boolean;
  error?: Error | null;
  query?: string;
  setQuery?: (query: string) => void;
}

interface DataContextType {
  data: any[] | null;
  setData: (data: any[] | null) => void;
  datasetParams: DatasetParams;
  setDatasetParams: (
    params: DatasetParams | ((params: DatasetParams) => DatasetParams)
  ) => void;
  resetPage: () => void;
  pageUpdater: () => void;
  handleSearchChange: (newSearchText: string) => void;
  handleSortChange: (newSortText: string) => void;
}

const defaultDataContext: DataContextType = {
  data: null,
  setData: () => {},
  datasetParams: {
    filters: {},
    searchText: "",
    searchColumns: "",
    sortColumn: "",
    currentPage: 1,
    pageSize: 10,
    debug: false,
    appendData: false,
    loading: false,
    error: null,
    query: "",
    setQuery: () => {},
  },
  setDatasetParams: () => {},
  resetPage: () => {},
  pageUpdater: () => {},
  handleSearchChange: () => {},
  handleSortChange: () => {},
};

const DataContext = createContext<DataContextType>(defaultDataContext);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within DataContextProvider");
  }
  return context;
};

interface DataContextProviderProps {
  value: DataContextType;
  children: ReactNode;
}

export const DataContextProvider: React.FC<DataContextProviderProps> = ({
  value,
  children,
}) => <DataContext.Provider value={value}>{children}</DataContext.Provider>;
