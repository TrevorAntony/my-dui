import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";
import ChartComponent from "../ui-elements/chart-component";

const StackedBarChart = ({
  container: Container,
  header = "Bar Chart",
  subHeader = header,
  ...props
}) => {
  const chartOptions = {
    plotOptions: {
      bar: {
        distributed: false, // Disable distributed colors as we're stacking
      },
    },
    ...props.options, // Allow overriding any other options
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

export default StackedBarChart;
