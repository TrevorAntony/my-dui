import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext } from "react";
interface DataContextType {
  data: unknown[];
  pageUpdater?: () => void;
  resetPage?: () => void;
  handleSearchChange?: (newSearchText: string) => void;
  handleSortChange?: (newSearchText: string) => void;
  setQuery?: Dispatch<SetStateAction<string>>;
  query?: string;
  loading?: boolean;
  searchText?: string;
  searchColumns?: string;
  pageSize?: string | number;
}
const defaultDataContext: DataContextType = {
  data: [],
  query: "",
  setQuery: () => {},
  resetPage: () => {},
  pageUpdater: () => {},
  loading: true,
  handleSearchChange: () => {},
  handleSortChange: () => {},
  searchColumns: undefined,
  pageSize: undefined,
};
const DataContext = createContext<DataContextType | undefined>(
  defaultDataContext,
);
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
