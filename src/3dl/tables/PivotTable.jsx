import React from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import { useState } from "react";
import { useDashboardContext } from "../utilities/Dashboard";
import { useDataContext } from "../utilities/DataContainer";

const PivotTable = ({
  container: ContainerComponent,
  header = "Pivot Table",
  subHeader = header,
}) => {
  const [pivotState, setPivotState] = useState({});
  const { state } = useDashboardContext();
  const data = useDataContext();
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

  // Wrap the content in ChartComponent
  const wrappedContent = <>{content}</>;

  // Conditionally wrap the ChartComponent in Container if provided
  return ContainerComponent ? (
    <ContainerComponent header={header} subHeader={subHeader}>
      {wrappedContent}
    </ContainerComponent>
  ) : (
    wrappedContent
  );
};

export default PivotTable;
