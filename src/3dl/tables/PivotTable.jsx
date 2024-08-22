import React from "react";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import { useState } from "react";
import { useDashboardContext } from "../utilities/Dashboard";

const PivotTable = ({
  container: ContainerComponent,
  header = "Pivot Table",
  subHeader = header,
  data,
}) => {
  const [pivotState, setPivotState] = useState({});
  const { state } = useDashboardContext();

  // Content to be rendered inside the ChartComponent
  const content = (
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
