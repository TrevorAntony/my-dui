import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";

// Define the shape of the data provided by the context
interface DataContextType {
  data: any[];
  pageUpdater?: () => void;
  handleSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Create the context with an empty default value
const DataContext = createContext<DataContextType | undefined>(undefined);

// Hook to use the DataContext
export const useDataContext = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};

// Define the props for the DataProvider component
interface DataProviderProps {
  value: DataContextType;
  children: ReactNode;
}

// DataProvider component to wrap the children with context
export const DataProvider: React.FC<DataProviderProps> = ({
  value,
  children,
}) => <DataContext.Provider value={value}>{children}</DataContext.Provider>;
