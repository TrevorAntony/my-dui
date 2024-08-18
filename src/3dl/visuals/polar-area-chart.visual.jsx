import React from "react";
import BaseCircularChart from "../base-visuals/base-circular-chart";

const PolarAreaChart = (props) => {
  return <BaseCircularChart {...props} chartType="polarArea" />;
};

export default PolarAreaChart;
