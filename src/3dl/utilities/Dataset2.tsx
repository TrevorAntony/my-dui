import React, { createContext, useContext, useState } from "react";

const DatasetContext = createContext({
  data: null,
  setData: (data: any) => {},
});

export const Dataset2: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<null | any[]>(null);

  return (
    <DatasetContext.Provider value={{ data, setData }}>
      {children}
    </DatasetContext.Provider>
  );
};

export const useDatasetContext = () => useContext(DatasetContext);
