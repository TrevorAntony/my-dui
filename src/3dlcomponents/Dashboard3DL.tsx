import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JSXParser from "react-jsx-parser";
import { fetchDataWithoutStore } from "../api/api";
import CardComponent from "../components/card-component";
import CardRow from "../components/card-row";

import {
  Dashboard,
  Filters,
  Filter,
  DataContainer,
  Visual1,
  Visual3,
  Visual4,
  Visual5,
  Section,
  PieChart,
  DonutChart,
  RadialBarChart,
  PolarAreaChart,
  BarChart,
  LineChart,
  HeatmapChart,
  RadarChart,
  SmartDataTable,
  DataTable,
  PreviewPage,
  PivotTable,
  JSONVisual,
  Row,
  Tab,
  TabHeader,
  TabSet,
  DashBoardBody,
  DashboardBodyOverride,
  Tile,
  StackedBarChart,
  PercentStackedBarChart,
  Grid,
  DashboardRow,
} from "../3dl";
import { DuftGrid } from "../ui-components/grid-components";
import useDuftQuery from "./resources/useDuftQuery";
import { DuftTabset, DuftTab } from "../ui-components/tab-components";

// const Dashboard3DLJSX = () => {
//   return <Dashboard></Dashboard>;
// };

const Dashboard3DL: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [dashboardData, setDashboardData] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDataWithoutStore(`/3dldashboard/${id}`)
        .then((data) => {
          //console.log("Fetched Dashboard Data:", data); // Log the fetched data

          const cleanedJSX = data
            .replace(/>\s+</g, "><") // Remove whitespace between tags
            .replace(/<>\s*<\/>/g, ""); // Remove empty fragments

          setDashboardData(cleanedJSX);
        })
        .catch((error) => console.error("Error loading dashboard data", error));
    }
  }, [id]);

  return (
    <DuftGrid>
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Dashboard 3D Layout
        </h1>
      </div>
      <CardRow columns={1}>
        <CardComponent
          header="Dashboard 3D Layout"
          subHeader="This was received from the server"
        >
          {id ? (
            dashboardData ? (
              <JSXParser
                components={{
                  Dashboard,
                  Filters,
                  Filter,
                  Visual1,
                  Visual3,
                  Visual4,
                  Visual5,
                  Section,
                  DataContainer: (props: unknown) => (
                    <DataContainer {...props} useQuery={useDuftQuery} />
                  ),
                  PieChart: (props: unknown) => (
                    <PieChart
                      {...props}
                      container={CardComponent}
                      header="Pie Chart Chart"
                      subHeader="A pie chart representative visual"
                    />
                  ),
                  DonutChart: (props: unknown) => (
                    <DonutChart
                      {...props}
                      container={CardComponent}
                      header="Donut Chart Chart"
                      subHeader="A donut chart representative visual"
                    />
                  ),
                  RadialBarChart: (props: unknown) => (
                    <RadialBarChart
                      {...props}
                      container={CardComponent}
                      header="Radial Bar Chart"
                      subHeader="A radial bar chart representative visual"
                    />
                  ),
                  PolarAreaChart: (props: unknown) => (
                    <PolarAreaChart
                      {...props}
                      container={CardComponent}
                      header="Polar area Chart"
                      subHeader="A polar area representative visual"
                    />
                  ),
                  BarChart: (props: unknown) => (
                    <BarChart
                      {...props}
                      container={CardComponent}
                      header="Bar Chart"
                      subHeader="A bar chart representative visual"
                    />
                  ),
                  LineChart: (props: unknown) => (
                    <LineChart
                      {...props}
                      container={CardComponent}
                      header="Line Chart"
                      subHeader="A line chart representative visual"
                    />
                  ),
                  HeatmapChart: (props: unknown) => (
                    <HeatmapChart
                      {...props}
                      container={CardComponent}
                      header="Heat Map Chart"
                      subHeader="A heat map chart representative visual"
                    />
                  ),
                  RadarChart: (props: unknown) => (
                    <RadarChart
                      {...props}
                      container={CardComponent}
                      header="Heat Map Chart"
                      subHeader="A heat map chart representative visual"
                    />
                  ),
                  SmartDataTable: (props: unknown) => (
                    <SmartDataTable
                      {...props}
                      container={CardComponent}
                      header="Smart data table"
                      subHeader="A smart data table representative visual"
                    />
                  ),
                  PivotTable: (props: unknown) => (
                    <PivotTable
                      {...props}
                      container={CardComponent}
                      header="Pivot Table"
                      subHeader="A pivot table representative visual"
                    />
                  ),
                  DataTable: (props: unknown) => (
                    <DataTable
                      {...props}
                      container={CardComponent}
                      header="Data table Chart"
                      subHeader="A data table representative visual"
                    />
                  ),
                  TabSet: (props: unknown) => (
                    <TabSet {...props} override={DuftTabset} />
                  ),
                  Tab: (props: unknown) => (
                    <Tab {...props} override={DuftTab} />
                  ),
                  PreviewPage,
                  JSONVisual,
                  Row,
                  TabHeader,
                  Tile,
                  StackedBarChart,
                  PercentStackedBarChart,
                  DashBoardBody,
                  Grid,
                  DashboardRow,
                }}
                jsx={dashboardData}
              />
            ) : (
              <p>Loading dashboard data...</p>
            )
          ) : (
            <p>No ID provided</p>
          )}
        </CardComponent>
      </CardRow>
    </DuftGrid>
  );
};

export default Dashboard3DL;
