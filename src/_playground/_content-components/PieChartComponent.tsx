import React from "react";
import Chart from "react-apexcharts";

type PieChartProps = {
  labels: string[];
  series: number[];
};

const PieChartComponent: React.FC<PieChartProps> = ({ labels, series }) => {
  const options = {
    labels,
    chart: {
      type: "pie" as const,
    },
    legend: {
      position: "bottom" as const,
      horizontalAlign: "center" as const,
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      fontSize: "14px",
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "12px",
          },
        },
      },
    ],
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <Chart options={options} series={series} type="pie" width="100%" />
    </div>
  );
};

export default PieChartComponent;
