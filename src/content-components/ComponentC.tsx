import React from "react";
import CardComponent from "../components/card-component";
import CardRow from "../components/card-row";
import PieChartComponent from "./PieChartComponent";
import { DuftGrid } from "../ui-components/grid-components";
import ClusteredBarChart from "../3dl/visuals/clustered-bar-chart.visual";

const ComponentC: React.FC = () => {
  const labels = ["Apple", "Mango", "Orange", "Banana"];
  const series = [44, 55, 13, 43];

  const data = [
    { Year: "2023", "Age Group": "0-9", Male: 258, Female: 287 },
    { Year: "2023", "Age Group": "10-19", Male: 1134, Female: 1394 },
    { Year: "2023", "Age Group": "20-29", Male: 841, Female: 4041 },
    { Year: "2024", "Age Group": "0-9", Male: 300, Female: 320 },
    { Year: "2024", "Age Group": "10-19", Male: 1200, Female: 1500 },
    { Year: "2024", "Age Group": "20-29", Male: 900, Female: 4100 },
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
          {/* <ClusteredBarChart
          header="Sales Data by Age Group and Year"
          data={data}
          colors={['#00E396', '#FF4560', '#775DD0', '#FEB019']}
        /> */}
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
