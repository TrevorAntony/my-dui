import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";

const DonutChart = ({
  container: Container,
  header = "Donut Chart",
  subHeader = header,
  ...props
}) => {
  // Content to be rendered
  const content = <BaseCircularChart {...props} chartType="donut" />;

  // Conditionally wrap the content in a Container if provided
  return Container ? (
    <Container header={header} subHeader={subHeader}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default DonutChart;
