import type { ReactNode } from "react";
import React from "react";
import { useDashboardContext, setFilter } from "../utilities/Dashboard";

interface FiltersProps {
  children: ReactNode;
}

const Filters: React.FC<FiltersProps> = ({ children }) => {
  const context = useDashboardContext();
  // Context check should be immediately after getting the context
  if (!context) {
    throw new Error("useDashboardContext must be used within a DashboardProvider");
  }

  const { state, dispatch } = context;

  const areAnyFiltersSet = (filters: Record<string, string[] | string>): boolean => {
    return Object.values(filters).some(value =>
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === 'string' && value.trim() !== '')
    );
  };

  const handleRemoveFilters = (state: typeof context.state, dispatch: typeof context.dispatch): void => {
    Object.keys(state.filters).forEach(filterName => {
      setFilter(dispatch, filterName, []);
    });
  };

  return (
    <div className="flex space-x-4 lg:pr-3">
      {children}
      {areAnyFiltersSet(state.filters) && (
        <button
          onClick={() => handleRemoveFilters(state, dispatch)}
          className="ml-2 flex items-center rounded-lg border border-gray-600 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default Filters;
