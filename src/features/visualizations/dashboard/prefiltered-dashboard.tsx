import React from "react";
import { useDashboardContext } from "./Dashboard";
import Alert from "./alert";

interface PrefilteredDashboardProps {
  children: React.ReactNode;
  filters: string; // Format: "filter1,filter2,filter3"
}

const PrefilteredDashboard: React.FC<PrefilteredDashboardProps> = ({
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
      <Alert
        missingFilters={missingFilters}
        description={
          "Please select the following filters to view all visuals in the dashboard:"
        }
      />
    );
  }

  return <>{children}</>;
};

export default PrefilteredDashboard;
