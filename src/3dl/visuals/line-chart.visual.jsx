import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const LineChart = ({
  container: Container,
  header = "Line Chart",
  subHeader = header,
  exportData,
  ...props
}) => {
  const content = <BaseXYChart {...props} chartType="line" />;

  return Container ? (
    <Container header={header} subHeader={subHeader} exportData={exportData}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default LineChart;
