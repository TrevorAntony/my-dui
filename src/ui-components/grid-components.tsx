import React, { ReactNode } from "react";

interface RowProps {
  children: ReactNode;
}

const GridFullRow: React.FC<RowProps> = ({ children }) => {
  return <div className="col-span-full">{children}</div>;
};

const GridHeader: React.FC<RowProps> = ({ children }) => {
  return (
    <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
      {children}
    </h1>
  );
};

export { GridFullRow as GridFullRow, GridHeader };
