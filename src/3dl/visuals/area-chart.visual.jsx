import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const AreaChart = (props) => {
    return <BaseXYChart {...props} chartType="area" />;
};

export default AreaChart;
