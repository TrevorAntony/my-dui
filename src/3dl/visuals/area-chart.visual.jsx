import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const AreaChart = ({
  container: Container,
  header = "Bar Chart",
  subHeader = header,
  exportData,
  ...props
}) => {
  const content = <BaseXYChart {...props} chartType="area" />;

  return Container ? (
    <Container header={header} subHeader={subHeader} exportData={exportData}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default AreaChart;
