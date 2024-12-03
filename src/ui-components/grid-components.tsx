/* eslint-disable tailwindcss/no-custom-classname */
import type { ReactNode } from "react";
import React from "react";
import { useLayout } from "../3dl/utilities/Dashboard";

interface RowProps {
  children: ReactNode;
}

interface DuftGridProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

const DuftGrid: React.FC<DuftGridProps> = ({ children, ...props }) => {
  const layout = useLayout();
  return (
    <div
      className={`mb-6 ${
        layout === "single-layout"
          ? "flex flex-col gap-y-4"
          : "grid grid-cols-1 gap-y-4 px-4 xl:gap-4"
      } dark:border-gray-700 dark:bg-gray-900`}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { ...props })
          : child
      )}
    </div>
  );
};

export default DuftGrid;

interface DuftGridFullRowProps {
  children: React.ReactNode;
  columns?: number;
  largeColumns?: number | string;
}

const DuftGridFullRow: React.FC<DuftGridFullRowProps> = ({
  children,
  columns = 3,
  largeColumns,
  ...props
}) => {
  const layout = useLayout();
  const largeScreenCols = largeColumns || columns;

  return (
    <div
      className={
        layout === "single-layout"
          ? "mb-1 w-full"
          : `md:grid-cols-${columns} xl:grid-cols-${largeScreenCols} grid w-full grid-cols-1 gap-4 sm:grid-cols-1`
      }
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { ...props })
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

const DuftSubheader: React.FC<RowProps> = ({ children }) => {
  const className =
    "mt-0 text-lg font-medium text-gray-800 dark:text-gray-300 md:mt-6";

  return (
    <div className="flex justify-start align-text-bottom md:justify-end">
      <h5 className={className}>{children}</h5>
    </div>
  );
};

export { DuftGrid, DuftGridFullRow, DuftGridHeader, DuftSubheader };
