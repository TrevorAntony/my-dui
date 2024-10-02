import React, { useState, useEffect } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import { useDashboardContext } from "../utilities/Dashboard";
import { useDataContext } from "../context/DataContext";

const PivotTable = ({
  container: ContainerComponent,
  header = "Pivot Table",
  subHeader = header,
  variant = "card", // Default to "card" variant
  pivotRows = [],
  pivotCols = [],
  exportData,
}) => {
  const initialPivotRows = pivotRows;
  const initialPivotCols = pivotCols;

  const [pivotState, setPivotState] = useState({
    data: [],
    rows: initialPivotRows,
    cols: initialPivotCols,
  });

  const { state } = useDashboardContext();
  const { data } = useDataContext();

  // Defensive check for data
  const hasValidData = data && Array.isArray(data) && data.length > 0;

  useEffect(() => {
    if (hasValidData) {
      // Get the keys of the first object in data
      const keys = Object.keys(data[0]);

      // Use provided pivotRows or default to the first key
      const activePivotRows =
        initialPivotRows.length > 0 ? initialPivotRows : [keys[0]];
      const activePivotCols =
        initialPivotCols.length > 0 ? initialPivotCols : keys.slice(1, 6);

      // Only update the state if the new rows or cols differ from the current state
      setPivotState((prevState) => {
        if (
          prevState.data !== data ||
          JSON.stringify(prevState.rows) !== JSON.stringify(activePivotRows) ||
          JSON.stringify(prevState.cols) !== JSON.stringify(activePivotCols)
        ) {
          return {
            ...prevState,
            data: data,
            rows: activePivotRows,
            cols: activePivotCols,
          };
        }
        return prevState;
      });
    }
  }, [data, initialPivotRows, initialPivotCols]);

  const content = hasValidData ? (
    <div>
      {state.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      <PivotTableUI
        {...pivotState}
        onChange={(newState) => setPivotState(newState)}
      />
    </div>
  ) : (
    <div>No data available to display the pivot table.</div>
  );

  // Conditionally wrap the content based on the variant and layout
  const wrappedContent =
    variant === "plain" ? (
      content
    ) : (
      <div
        className={`p-4 ${variant === "card" ? "rounded border shadow" : ""}`}
      >
        {content}
      </div>
    );

  // Conditionally wrap the ChartComponent in Container if provided
  return ContainerComponent ? (
    <ContainerComponent
      header={header}
      subHeader={subHeader}
      variant={variant}
      exportData={exportData}
    >
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default PivotTable;
