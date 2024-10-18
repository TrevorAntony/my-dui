import React from "react";
import { useDataContext } from "../context/DataContext";

type QueryProps = {
  children: React.ReactNode;
};

const Query: React.FC<QueryProps> = ({ children }) => {
  const { setQuery } = useDataContext();

  const queryString = extractStringValue(children);
  setQuery(queryString);

  return <></>;
};

export default Query;

const extractStringValue = (children: React.ReactNode) => {
  if (React.isValidElement(children)) {
    return children.props.children?.trim() as string;
  }
  return "";
};
