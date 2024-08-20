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
} from "../3dl";
import { DuftGrid } from "../ui-components/grid-components";
import useDuftQuery from "./resources/useDuftQuery";

// const Dashboard3DLJSX = () => {
//   return <Dashboard></Dashboard>;
// };

const Dashboard3DL: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [dashboardData, setDashboardData] = useState<string | null>(null);

  console.log(StackedBarChart);

  useEffect(() => {
    if (id) {
      fetchDataWithoutStore(`/3dldashboard/${id}`)
        .then((data) => {
          //console.log("Fetched Dashboard Data:", data); // Log the fetched data
          setDashboardData(data);
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
                  DataContainer: (props: unknown) => (
                    <DataContainer {...props} useQuery={useDuftQuery} />
                  ),
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
                  Tile,
                  StackedBarChart,
                  PercentStackedBarChart,
                  DashBoardBody: (props: unknown) => (
                    <DashBoardBody
                      {...props}
                      OverrideComponent={DashboardBodyOverride}
                    />
                  ),
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
