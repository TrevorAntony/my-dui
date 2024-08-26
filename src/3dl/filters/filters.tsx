import React, { ReactNode } from "react";

// Define the props type for Filters component
interface FiltersProps {
  children: ReactNode;
}

// Filters component to structure child components
const Filters: React.FC<FiltersProps> = ({ children }) => {
  return <div className="flex-auto space-x-4 lg:pr-3">{children}</div>;
};

export default Filters;
