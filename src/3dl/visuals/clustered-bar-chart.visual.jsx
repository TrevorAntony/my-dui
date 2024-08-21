import React from 'react';
import Chart from 'react-apexcharts';
import ChartComponent from "../ui-elements/chart-component";

const ClusteredBarChart = ({ header, data, colors, isHorizontal }) => {
    // Get the category column label and group key label
    const categoryColumn = Object.keys(data[0])[0];  // Assuming the first key is the category column
    const groupColumn = Object.keys(data[0])[0];

    // Extract categories and series data from the rectangular data
    const categories = [...new Set(data.map((item) => item[categoryColumn]))];
    const groups = [...new Set(data.map((item) => item[groupColumn]))];

    // Prepare series data for each group
    const series = groups.map((group) => {
        return Object.keys(data[0])
            .filter((key) => key !== categoryColumn && key !== groupColumn)
            .map((key) => {
                return {
                    name: `${key} (${group})`,
                    data: data
                        .filter((item) => item[groupColumn] === group)
                        .map((item) => item[key]),
                };
            });
    }).flat(); // Flatten the array to make sure all series are in the same array

    // Chart options for grouped bars
    const chartOptions = {
        chart: {
            type: 'bar',
            stacked: false, // Disable stacking to make grouped bars
        },
        plotOptions: {
            bar: {
                horizontal: isHorizontal || false,
                borderRadius: 5,
                columnWidth: '100%'
            },
        },
        xaxis: {
            categories: categories || [], // Use provided categories or default to empty array
        },
        yaxis: {
            labels: {
                formatter: (val) => `${val}`,
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `${val}`,
            },
        },
        legend: {
            show: true,
            position: "top", // Position legend on top of the chart
        },
        fill: {
            opacity: 1,
        },
        colors: colors || ["#00E396", "#FF4560", "#775DD0", "#FEB019"], // Default colors if none provided
        stroke: {
            show: true,
            width: 1,
            colors: ["#fff"], // White line between stacked bars
        },
        title: {
            text: header || 'Chart Title',
            align: 'left',
        },
    };

    return (
        <div>
            <ChartComponent header={header}>
                <Chart options={chartOptions} series={series} type="bar" width="500" />
            </ChartComponent>
        </div>
    );
};

export default ClusteredBarChart;
