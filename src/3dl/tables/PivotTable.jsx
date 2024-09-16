import React, { useState } from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import { useDashboardContext } from "../utilities/Dashboard";
import { useDataContext } from "../context/DataContext";

const PivotTable = ({
  container: ContainerComponent,
  header = "Pivot Table",
  subHeader = header,
  variant = "card", // Default to "card" variant
}) => {
  const [pivotState, setPivotState] = useState({});
  const { state } = useDashboardContext();
  const { data } = useDataContext();

  // Defensive check for data
  const hasValidData = data && Array.isArray(data) && data.length > 0;

  // Content to be rendered inside the ChartComponent
  const content = hasValidData ? (
    <div>
      {state.debug && (
        <div style={{ color: "red", fontWeight: "bold" }}>Debug On</div>
      )}
      <PivotTableUI
        data={data}
        onChange={(s) => setPivotState(s)}
        {...pivotState}
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
