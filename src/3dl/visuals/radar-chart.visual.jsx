import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const RadarChart = ({
  container: Container,
  header = "Radar Chart",
  subHeader = header,
  exportData,
  ...props
}) => {
  const content = <BaseXYChart {...props} chartType="radar" />;

  return Container ? (
    <Container header={header} subHeader={subHeader} exportData={exportData}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default RadarChart;
