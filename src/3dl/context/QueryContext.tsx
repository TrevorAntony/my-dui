import type { ReactNode } from "react";
import React, { createContext, useState, useContext } from "react";

interface QueryContextProps {
  query: string;
  setQuery: (query: string) => void;
}

const QueryContext = createContext<QueryContextProps | undefined>(undefined);

const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string>("");

  return (
    <QueryContext.Provider value={{ query, setQuery }}>
      {children}
    </QueryContext.Provider>
  );
};

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error("useQueryContext must be used within a QueryProvider");
  }
  return context;
};

export default QueryProvider;
