import type { ReactNode } from "react";
import React from "react";

interface FiltersProps {
  children: ReactNode;
}

const Filters: React.FC<FiltersProps> = ({ children }) => {
  return <div className="flex-auto space-x-4 lg:pr-3">{children}</div>;
};

export default Filters;
