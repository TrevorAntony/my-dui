import React from "react";
import BaseXYChart from "../base-visuals/base-xy-chart";

const StackedBarChart = (props) => {
    // Pass the "stacked" configuration to the BaseXYChart component
    const chartOptions = {
        chart: {
            stacked: true, // Ensure the chart is always stacked
        },
        plotOptions: {
            bar: {
                horizontal: false, // Optional: Set to true if you want horizontal stacked bars
                distributed: false, // Disable distributed colors as we're stacking
            },
        },
        ...props.options, // Allow overriding any other options
    };

    return <BaseXYChart {...props} chartType="bar" options={chartOptions} />;
};

export default StackedBarChart;
