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

interface DuftGridFullRowProps {
  children: React.ReactNode;
  mediumCols?: number;
  largeCols?: number;
}

const DuftGridFullRow: React.FC<DuftGridFullRowProps> = ({
  children,
  mediumCols = 2,
  largeCols = 3,
}) => {
  const largeScreenCols = largeCols || mediumCols;

  return (
    <div
      className={`md:grid-cols-${mediumCols} xl:grid-cols-${largeScreenCols} grid w-full grid-cols-1 gap-4`}
    >
      {children}
    </div>
  );
};

const DuftGridHeader: React.FC<RowProps> = ({ children }) => {
  return (
    <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
      {children}
    </h1>
  );
};

export { DuftGrid, DuftGridFullRow, DuftGridHeader };
