import type React from "react";
import { useDataContext } from "../context/DataContext";

type QueryProps = {
  children: React.ReactNode;
};

const Query: React.FC<QueryProps> = ({ children }) => {
  const { setQuery } = useDataContext();

  const queryString = extractStringValue(children);

  setQuery(queryString);
};

export default Query;

const extractStringValue = (children: React.ReactNode) => {
  return children?.props?.children?.trim() as string;
};
