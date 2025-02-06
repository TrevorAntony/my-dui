import type { ReactNode } from "react";
import React, { createContext, useState, useContext } from "react";

interface QueryContextProps {
  query: string;
  setQuery: (query: string) => void;
}

const QueryContext = createContext<QueryContextProps | undefined>(undefined);

const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string>(
    "SELECT * FROM dim_client LIMIT 10",
  );

  return (
    <QueryContext.Provider value={{ query, setQuery }}>
      {children}
    </QueryContext.Provider>
  );
};

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  return context || { query: "", setQuery: () => null };
};

export default QueryProvider;
