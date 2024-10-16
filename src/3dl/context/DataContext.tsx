import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext } from "react";

interface DataContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  pageUpdater?: () => void;
  resetPage?: () => void;
  handleSearchChange?: (newSearchText: string) => void;
  handleSortChange?: (newSearchText: string) => void;
  setQuery: Dispatch<SetStateAction<string>>;
  query: string;
  loading?: boolean;
  searchText?: string;
  searchColumns?: string;
  pageSize?: string | number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

interface DataProviderProps {
  value: DataContextType;
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({
  value,
  children,
}) => <DataContext.Provider value={value}>{children}</DataContext.Provider>;
