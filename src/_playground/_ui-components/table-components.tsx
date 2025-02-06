import type { ReactNode } from "react";
import React from "react";

interface DuftSingleViewProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

interface DuftSingleViewComponent extends React.FC<DuftSingleViewProps> {
  Header: React.FC<{ children: ReactNode }>;
}

const DuftSingleView: DuftSingleViewComponent = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  return (
    <div
      className="block items-center justify-between border-y border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex"
      {...props}
    >
      <div className="mb-1 w-full">
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { ...props })
            : child,
        )}
      </div>
    </div>
  );
};

const Header: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <h1 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
      {children}
    </h1>
  );
};

DuftSingleView.Header = Header;

export default DuftSingleView;
