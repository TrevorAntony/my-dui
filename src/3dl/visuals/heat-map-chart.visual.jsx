import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const HeatmapChart = ({
  container: Container,
  header = "Heat-map Chart",
  subHeader = header,
  exportData,
  ...props
}) => {
  const content = <BaseXYChart {...props} chartType="heatmap" />;

  return Container ? (
    <Container header={header} subHeader={subHeader} exportData={exportData}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default HeatmapChart;
