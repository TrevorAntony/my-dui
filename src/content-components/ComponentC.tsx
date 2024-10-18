import React from "react";
import CardComponent from "../components/card-component";
import CardRow from "../components/card-row";
import PieChartComponent from "./PieChartComponent";
import { DuftGrid } from "../ui-components/grid-components";

const ComponentC: React.FC = () => {
  const labels = ["Apple", "Mango", "Orange", "Banana"];
  const series = [44, 55, 13, 43];

  const data = [
    {
      CID: "1025682",
      "Date of Birth": "24/12/1960",
      Age: "62",
      Gender: "Female",
      Marital: "Single",
    },
    {
      CID: "1132573",
      "Date of Birth": "14/10/1979",
      Age: "44",
      Gender: "Male",
      Marital: "Married monogamous",
    },
    {
      CID: "1132580",
      "Date of Birth": "15/6/1981",
      Age: "42",
      Gender: "Male",
      Marital: "Married monogamous",
    },
    {
      CID: "1132585",
      "Date of Birth": "28/11/1976",
      Age: "47",
      Gender: "Female",
      Marital: "Married monogamous",
    },
    {
      CID: "1132596",
      "Date of Birth": "15/6/1990",
      Age: "33",
      Gender: "Female",
      Marital: "Married monogamous",
    },
    {
      CID: "1025682",
      "Date of Birth": "24/12/1960",
      Age: "62",
      Gender: "Female",
      Marital: "Single",
    },
    {
      CID: "1132573",
      "Date of Birth": "14/10/1979",
      Age: "44",
      Gender: "Male",
      Marital: "Married monogamous",
    },
    {
      CID: "1132580",
      "Date of Birth": "15/6/1981",
      Age: "42",
      Gender: "Male",
      Marital: "Married monogamous",
    },
    {
      CID: "1132585",
      "Date of Birth": "28/11/1976",
      Age: "47",
      Gender: "Female",
      Marital: "Married monogamous",
    },
    {
      CID: "1132596",
      "Date of Birth": "15/6/1990",
      Age: "33",
      Gender: "Female",
      Marital: "Married monogamous",
    },
    {
      CID: "1025682",
      "Date of Birth": "24/12/1960",
      Age: "62",
      Gender: "Female",
      Marital: "Single",
    },
    {
      CID: "1132573",
      "Date of Birth": "14/10/1979",
      Age: "44",
      Gender: "Male",
      Marital: "Married monogamous",
    },
    {
      CID: "1132580",
      "Date of Birth": "15/6/1981",
      Age: "42",
      Gender: "Male",
      Marital: "Married monogamous",
    },
    {
      CID: "1132585",
      "Date of Birth": "28/11/1976",
      Age: "47",
      Gender: "Female",
      Marital: "Married monogamous",
    },
    {
      CID: "1132596",
      "Date of Birth": "15/6/1990",
      Age: "33",
      Gender: "Female",
      Marital: "Married monogamous",
    },
    {
      CID: "1025682",
      "Date of Birth": "24/12/1960",
      Age: "62",
      Gender: "Female",
      Marital: "Single",
    },
    {
      CID: "1132573",
      "Date of Birth": "14/10/1979",
      Age: "44",
      Gender: "Male",
      Marital: "Married monogamous",
    },
    {
      CID: "1132580",
      "Date of Birth": "15/6/1981",
      Age: "42",
      Gender: "Male",
      Marital: "Married monogamous",
    },
    {
      CID: "1132585",
      "Date of Birth": "28/11/1976",
      Age: "47",
      Gender: "Female",
      Marital: "Married monogamous",
    },
    {
      CID: "1132596",
      "Date of Birth": "15/6/1990",
      Age: "33",
      Gender: "Female",
      Marital: "Married monogamous",
    },
  ];

  return (
    <DuftGrid>
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
