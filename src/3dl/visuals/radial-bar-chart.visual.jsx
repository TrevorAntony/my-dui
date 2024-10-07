import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";

const RadialBarChart = ({
  container: Container,
  header = "Radial Bar Chart",
  subHeader = header,
  exportData,
  detailsComponent,
  ...props
}) => {
  // Content to be rendered
  const content = <BaseCircularChart {...props} chartType="radialBar" />;

  // Conditionally wrap the content in a Container if provided
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

export default RadialBarChart;
