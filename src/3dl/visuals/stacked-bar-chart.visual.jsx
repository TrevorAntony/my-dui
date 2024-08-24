import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const StackedBarChart = (props) => {
  const chartOptions = {
    chart: {
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        distributed: false,
      },
    },
    ...props.options,
  };

  return <BaseXYChart {...props} chartType="bar" options={chartOptions} />;
};

export default StackedBarChart;
