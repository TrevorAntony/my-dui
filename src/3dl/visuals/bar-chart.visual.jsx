import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const BarChart = ({
  container: Container,
  header = "Bar Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  ...props
}) => {
  const content = <BaseXYChart {...props} chartType="bar" />;

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

export default BarChart;
