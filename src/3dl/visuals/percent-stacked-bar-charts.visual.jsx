import React from 'react';
import BaseXYChart from '../base-visuals/base-xy-chart';

const PercentStackedBarChart = (props) => {
    // Define options specifically for a 100% stacked bar chart
    const chartOptions = {
        chart: {
            stacked: true, // Ensure the chart is stacked
        },
        plotOptions: {
            bar: {
                horizontal: false, // Set to true if you want horizontal bars
                distributed: false, // Disable distributed colors as we're stacking
                barHeight: '100%', // Ensure the bars fill 100% of the chart height
            },
        },
        yaxis: {
            max: 100, // Ensure the y-axis is scaled to 100%
            labels: {
                formatter: (val) => `${val}%`, // Format y-axis labels as percentages
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `${val}%`, // Format tooltip values as percentages
            },
        },
        ...props.options, // Allow overriding any other options
    };

    return <BaseXYChart {...props} chartType="bar" options={chartOptions} />;
};

export default PercentStackedBarChart;
