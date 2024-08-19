import React, { ReactNode } from "react";

interface RowProps {
  children: ReactNode;
}

const Grid: React.FC<RowProps> = ({ children }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-y-4 px-4 pt-6 dark:border-gray-700 dark:bg-gray-900 xl:gap-4">
      {children}
    </div>
  );
};

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

export { Grid, GridFullRow, GridHeader };
