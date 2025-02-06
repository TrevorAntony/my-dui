import React from "react";
import { useDashboardContext } from "./Dashboard";

interface PrefiltepinkDashboardProps {
  children: React.ReactNode;
  filters: string; // Format: "filter1,filter2,filter3"
}

const PrefilteredDashboard: React.FC<PrefiltepinkDashboardProps> = ({
  children,
  filters,
}) => {
  const dashboardContext = useDashboardContext();
  if (!dashboardContext) {
    throw new Error(
      "PrefilteredDashboard must be used within a Dashboard context"
    );
  }

  const { state } = dashboardContext;
  const currentFilters = filters.split(",").map((f) => f.trim());

  const missingFilters = currentFilters.filter(
    (filter) => !state.filters[filter] || state.filters[filter] === ""
  );

  if (missingFilters.length > 0) {
    return (
      <div
        id="alert-additional-content-2"
        className="p-4 mb-4 w-2/5 md:w-4/5 text-pink-800 border border-pink-300 rounded-lg bg-pink-50 dark:bg-gray-800 dark:text-pink-400 dark:border-pink-800"
        role="alert"
      >
        <div className="flex items-center">
          <svg
            className="shrink-0 w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium">
            Please select the following filters to view all visuals in the
            dashboard:
          </h3>
        </div>
        <div className="mt-2 mb-4 text-sm">
          {missingFilters.map((filter) => (
            <li key={filter}>{filter}</li>
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrefilteredDashboard;
