import type { ReactNode } from "react";
import React from "react";

interface RowProps {
  children: ReactNode;
}

interface DuftGridProps {
  children: React.ReactNode;
  [key: string]: any; // Accept additional props
}

const DuftGrid: React.FC<DuftGridProps> = ({ children, ...props }) => {
  return (
    <div
      className="mb-6 grid grid-cols-1 gap-y-4 px-4 dark:border-gray-700 dark:bg-gray-900 xl:gap-4"
      {...props} // Pass additional props to the grid container
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { ...props }) // Pass additional props to each child
          : child
      )}
    </div>
  );
};

export default DuftGrid;

const DuftGridFullRow: React.FC<RowProps> = ({ children }) => {
  // return <div className="col-span-full">{children}</div>;
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {children}
    </div>
  );
};

const DuftGridHeader: React.FC<RowProps> = ({ children }) => {
  return (
    <h1 className="m-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
      {children}
    </h1>
  );
};

export { DuftGrid, DuftGridFullRow, DuftGridHeader };
