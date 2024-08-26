import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";
import ChartComponent from "../ui-elements/chart-component";

const PercentStackedBarChart = ({
  container: Container,
  header = "Bar Chart",
  subHeader = header,
  ...props
}) => {
  // Chart options for 100% stacked bars
  const chartOptions = {
    chart: {
      stackType: "100%", // Set to 100% stacked bar
    },
  };

  const content = (
    <BaseXYChart {...props} chartType="bar" options={chartOptions} />
  );

  return Container ? (
    <Container header={header} subHeader={subHeader}>
      {content}
    </Container>
  ) : (
    content
  );
};

export default PercentStackedBarChart;
