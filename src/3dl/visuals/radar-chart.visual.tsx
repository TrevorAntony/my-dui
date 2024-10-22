import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";
import type { VisualProps } from "../../types/visual-props";

const RadarChart = ({
  container: Container,
  header = "Radar Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  ...props
}: VisualProps) => {
  const content = <BaseXYChart {...props} chartType="radar" />;

  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default RadarChart;
