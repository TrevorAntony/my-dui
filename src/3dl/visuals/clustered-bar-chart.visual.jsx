import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";
import ChartComponent from "../ui-elements/chart-component";

const ClusteredBarChart = ({
  container: Container,
  header = "Bar Chart",
  subHeader = header,
  ...props
}) => {
  // Chart options for grouped bars
  const chartOptions = {
    chart: {
      stacked: false, // Disable stacking for grouped bars
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
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

export default ClusteredBarChart;
