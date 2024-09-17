import React, { useState, useEffect } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import { useDashboardContext } from "../utilities/Dashboard";
import { useDataContext } from "../utilities/DataSet";

const PivotTable = ({
  container: ContainerComponent,
  header = "Pivot Table",
  subHeader = header,
  variant = "card", // Default to "card" variant
  pivotRows = [],
  pivotCols = []
}) => {
  const [pivotState, setPivotState] = useState({
    data: [],
    rows: pivotRows,
    cols: pivotCols
  });

  const { state } = useDashboardContext();
  const data = useDataContext();

  // Defensive check for data
  const hasValidData = data && Array.isArray(data) && data.length > 0;

  useEffect(() => {
    if (hasValidData && data.length > 0) {
      // Get the keys of the first object in data
      const keys = Object.keys(data[0]);

      // Use provided pivotRows or default to the first key
      const activePivotRows = pivotRows.length > 0 ? pivotRows : [keys[0]];

      // Use provided pivotCols or default to the next five keys starting from the second key
      const activePivotCols = pivotCols.length > 0 ? pivotCols : keys.slice(1, 6);

      // Update the state with pivotRows and pivotCols
      setPivotState((prevState) => ({
        ...prevState,
        data: data,
        rows: activePivotRows,
        cols: activePivotCols
      }));
    }
  }, [data, hasValidData, pivotRows, pivotCols]); // Ensure useEffect runs when data, pivotRows, or pivotCols change

  // Content to be rendered inside the ChartComponent
  const content = hasValidData ? (
    <div>
      {state.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      <PivotTableUI
        {...pivotState}
        onChange={newState => setPivotState(newState)}
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
    <ContainerComponent header={header} subHeader={subHeader} variant={variant}>
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default PivotTable;
