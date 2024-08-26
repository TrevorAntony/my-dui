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
  columns?: number;
  largeColumns?: number;
}

const DuftGridFullRow: React.FC<DuftGridFullRowProps> = ({
  children,
  // mediumCols = 2,
  // largeCols = 3,
  columns = 3,
  largeColumns,
  ...props
}) => {
  const largeScreenCols = largeColumns || columns;

  return (
    <div
      className={`md:grid-cols- grid-cols-1 sm:grid-cols-2${columns} xl:grid-cols-${largeScreenCols} grid w-full gap-4`}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { ...props }) // Pass additional props to each child
          : child
      )}
    </div>
  );
};

interface RowProps {
  children: React.ReactNode;
  small?: boolean;
}

const DuftGridHeader: React.FC<RowProps> = ({ children, small }) => {
  const Tag = small ? "h2" : "h1";
  const className = small
    ? "mt-4 text-lg font-semibold text-gray-900 dark:text-white sm:text-xl"
    : "mt-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl";

  return <Tag className={className}>{children}</Tag>;
};

export { DuftGrid, DuftGridFullRow, DuftGridHeader };
