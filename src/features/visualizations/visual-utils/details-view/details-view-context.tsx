import { createContext, useContext } from "react";

interface DetailsViewContextType {
  columnName: string;
  config: { [key: string]: string };
}

const initialContext: DetailsViewContextType = {
  columnName: "",
  config: {},
};

const DetailsViewContext =
  createContext<DetailsViewContextType>(initialContext);

export const useDetailsViewContext = () => {
  return useContext(DetailsViewContext);
};

export default DetailsViewContext;
