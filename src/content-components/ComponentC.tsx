import React from "react";
import CardComponent from "../components/card-component";
import CardRow from "../components/card-row";
import PieChartComponent from "./PieChartComponent";
import { DuftGrid } from "../ui-components/grid-components";
import StackedBarChart from "../3dl/visuals/stacked-bar-chart.visual";

const ComponentC: React.FC = () => {
  const labels = ["Apple", "Mango", "Orange", "Banana"];
  const series = [44, 55, 13, 43];

  const stackedBarChartData = [
    { category: "Q1 2024", ProductA: 30, ProductB: 40, ProductC: 25 },
    { category: "Q2 2024", ProductA: 20, ProductB: 35, ProductC: 50 },
    { category: "Q3 2024", ProductA: 25, ProductB: 30, ProductC: 35 },
    { category: "Q4 2024", ProductA: 35, ProductB: 20, ProductC: 45 },
  ];

  return (
    <DuftGrid>
      <CardRow columns={2}>
        <CardComponent
          header="A simple chart"
          subHeader="Showing nothing you don't like Showing nothing you don't like Showing nothing you don't like"
          moreInfo={{ text: "Sales Report", link: "/b" }}
          footer={<div>Footer</div>}
        >
          <StackedBarChart
            header="Sales Data by Quarter (2023)"
            data={stackedBarChartData}
            colors={["#00E396", "#FF4560", "#775DD0"]} // Optional: Custom colors
          />
        </CardComponent>
        <CardComponent
          header="A simple chart"
          subHeader="Showing nothing you don't like Showing nothing you don't like Showing nothing you don't like"
          moreInfo={{ text: "Sales Report", link: "/b" }}
          footer={<div>Footer</div>}
        >
          <div>
            This is Component C. This is Component C. This is Component C. This
            is Component C. This is Component C. This dkfekaf fljhs fjshg srg
            dsgjlh gis Component C. This is Component C. This is Component C.
            This is Component C. This is Component C.
          </div>
        </CardComponent>
      </CardRow>
      <CardRow columns={3}>
        <CardComponent header="Have some pie">
          <PieChartComponent labels={labels} series={series} />
        </CardComponent>
        <CardComponent header="Have some pie" footer={<div>Footer</div>}>
          <PieChartComponent labels={labels} series={series} />
        </CardComponent>
        <CardComponent header="Have some pie">
          <PieChartComponent labels={labels} series={series} />
        </CardComponent>
      </CardRow>
      <CardRow columns={1}>
        <CardComponent
          header="A simple chart"
          subHeader="Showing nothing you don't like Showing nothing you don't like Showing nothing you don't like"
          moreInfo={{ text: "Sales Report", link: "/b" }}
          footer={<div>Footer</div>}
        >
          <div>
            This is Component C. This is Component C. This is Component C. This
            is Component C. This is Component C. This dkfekaf fljhs fjshg srg
            dsgjlh gis Component C. This is Component C. This is Component C.
            This is Component C. This is Component C.
          </div>
        </CardComponent>
      </CardRow>
    </DuftGrid>
  );
};

export default ComponentC;
