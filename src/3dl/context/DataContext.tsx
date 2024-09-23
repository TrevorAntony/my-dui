import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { createContext, useContext } from "react";

interface DataContextType {
  data: any[];
  pageUpdater?: () => void;
  resetPage?: () => void;
  handleSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setQuery: Dispatch<SetStateAction<string>>;
  query: string;
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
