import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";
import ChartComponent from "../ui-elements/chart-component";

const BarChart = ({
  container: Container,
  header = "Bar Chart",
  subHeader = header,
  ...props
}) => {
  const content = <BaseXYChart {...props} chartType="bar" />;

  return Container ? (
    <Container header={header} subHeader={subHeader}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default BarChart;
