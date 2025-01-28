import { createContext, FC, ReactNode, useContext } from "react";

type StaticDataType = any[];

export const StaticDataContext = createContext<StaticDataType | undefined>(undefined);

interface StaticDataProps {
  data?: StaticDataType;
  children: ReactNode;
}

const StaticData: FC<StaticDataProps> = ({ data = [], children }) => {
  return (
    <StaticDataContext.Provider value={data}>
      {children}
    </StaticDataContext.Provider>
  );
};

export const useStaticDataContext = () => {
  const context = useContext(StaticDataContext);
  if (context === undefined) {
    throw new Error(
      "useStaticDataContext must be used within a StaticData provider"
    );
  }
  return context;
};

export default StaticData;

