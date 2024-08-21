import React from 'react';
import CardComponent from '../components/card-component';
import CardRow from '../components/card-row';
import PieChartComponent from './PieChartComponent';
import { DuftGrid } from '../ui-components/grid-components';
import PercentStackedBarChart from '../3dl/visuals/percent-stacked-bar-charts.visual';

const ComponentC: React.FC = () => {
  const labels = ['Apple', 'Mango', 'Orange', 'Banana'];
  const series = [44, 55, 13, 43];

  const data = [
    { 'Age Group': '0-9', Male: 258, Female: 287 },
    { 'Age Group': '10-19', Male: 1134, Female: 1394 },
    { 'Age Group': '20-29', Male: 841, Female: 4041 },
    { 'Age Group': '30-39', Male: 2637, Female: 8882 },
    { 'Age Group': '40-49', Male: 3876, Female: 6530 },
    { 'Age Group': '50-59', Male: 2291, Female: 3202 },
    { 'Age Group': '60-69', Male: 1297, Female: 1647 },
    { 'Age Group': '70+', Male: 529, Female: 508 },
  ];

  return (
    <DuftGrid>
      <CardRow columns={2}>
        <CardComponent
          header="A simple chart"
          subHeader="Showing nothing you don't like Showing nothing you don't like Showing nothing you don't like"
          moreInfo={{ text: 'Sales Report', link: '/b' }}
          footer={<div>Footer</div>}
        >
          <PercentStackedBarChart
            header="Sales Data by Age Group"
            data={data}
            colors={['#00E396', '#FF4560']}
          />
        </CardComponent>
        <CardComponent
          header="A simple chart"
          subHeader="Showing nothing you don't like Showing nothing you don't like Showing nothing you don't like"
          moreInfo={{ text: 'Sales Report', link: '/b' }}
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
          moreInfo={{ text: 'Sales Report', link: '/b' }}
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
