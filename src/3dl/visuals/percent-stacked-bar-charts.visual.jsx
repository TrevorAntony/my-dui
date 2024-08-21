import React from 'react';
import Chart from 'react-apexcharts';

const PercentStackedBarChart = ({ header, data, colors }) => {
    // Get the category column label
    const categoryColumn = Object.keys(data[0])[0];
    // Extract categories and series data from the rectangular data
    const categories = data.map((item) => item[categoryColumn]);

    // Prepare series data
    const series = Object.keys(data[0] || {})
        .filter((key) => key !== categoryColumn)
        .map((key) => {
            return {
                name: key,
                data: data.map((item) => item[key]),
            };
        });

    // Chart options
    const chartOptions = {
        chart: {
            type: 'bar',
            stacked: true,
            stackType: '100%',
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            categories: categories || [], // Use provided categories or default to empty array
        },
        yaxis: {
            max: 100,
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
        },
        colors: colors || ['#00E396', '#FF4560', '#775DD0'], // Default colors if not provided
        title: {
            text: header || 'Chart Title', // Adding the header as title
            align: 'left',
        },
    };

    return (
        <Chart options={chartOptions} series={series} type="bar" height={350} />
    );
};

export default PercentStackedBarChart;
