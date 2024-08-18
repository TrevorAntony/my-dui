import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const HeatmapChart = (props) => {
  return <BaseXYChart {...props} chartType="heatmap" />;
};

export default HeatmapChart;
