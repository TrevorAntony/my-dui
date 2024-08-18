import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const LineChart = (props) => {
  return <BaseXYChart {...props} chartType="line" />;
};

export default LineChart;
