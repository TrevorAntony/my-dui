import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JSXParser from "react-jsx-parser";
import { fetchDataWithoutStore } from "../api/api";
import CardComponent from "../components/card-component";

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
  AreaChart,
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
  Tile,
  StackedBarChart,
  PercentStackedBarChart,
  ClusteredBarChart,
  DashboardRow,
  DashboardHeader,
} from "../3dl";
import {
  DuftGrid,
  DuftGridFullRow,
  DuftGridHeader,
  DuftRow,
} from "../ui-components/grid-components";
import useDuftQuery from "./resources/useDuftQuery";
import { DuftTabset, DuftTab } from "../ui-components/tab-components";
import DuftTile from "../components/duft-tile";
import DuftFilter from "../ui-components/filter-components";
import DuftSingleView from "../ui-components/table-components";

// const Dashboard3DLJSX = () => {
//   return <Dashboard></Dashboard>;
// };

const useDashboardData = (id) => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (id) {
      fetchDataWithoutStore(`/3dldashboard/${id}`)
        .then((data) => {
          // Remove unnecessary whitespace and empty fragments
          const cleanedJSX = data
            .replace(/>\s+</g, "><") // Remove whitespace between tags
            .replace(/<>\s*<\/>/g, ""); // Remove empty fragments

          setDashboardData(cleanedJSX);
        })
        .catch((error) => console.error("Error loading dashboard data", error));
    }
  }, [id]);

  return dashboardData;
};

const useThemeData = () => {
  const [themeData, setThemeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const data = await fetchDataWithoutStore("/theme");
        setThemeData(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, []);

  return { themeData, loading, error };
};

const Dashboard3DL: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dashboardData = useDashboardData(id);
  const { themeData } = useThemeData();

  return (
    <>
      {id ? (
        dashboardData ? (
          <JSXParser
            components={{
              Dashboard: (props: unknown) => (
                <Dashboard {...props} theme={themeData} />
              ),
              //DashboardHeader: DuftGridHeader,
              Header: DuftGridHeader,
              Filters,
              Filter: DuftFilter,
              Visual1,
              Visual3,
              Visual4,
              Visual5,
              Section,
              DataContainer: (props: unknown) => (
                <DataContainer {...props} useQuery={useDuftQuery} />
              ),
              PieChart: (props: unknown) => (
                <PieChart {...props} container={CardComponent} />
              ),
              DonutChart: (props: unknown) => (
                <DonutChart {...props} container={CardComponent} />
              ),
              RadialBarChart: (props: unknown) => (
                <RadialBarChart {...props} container={CardComponent} />
              ),
              PolarAreaChart: (props: unknown) => (
                <PolarAreaChart {...props} container={CardComponent} />
              ),
              BarChart: (props: unknown) => (
                <BarChart {...props} container={CardComponent} />
              ),
              LineChart: (props: unknown) => (
                <LineChart {...props} container={CardComponent} />
              ),
              HeatmapChart: (props: unknown) => (
                <HeatmapChart {...props} container={CardComponent} />
              ),
              RadarChart: (props: unknown) => (
                <RadarChart {...props} container={CardComponent} />
              ),
              SmartDataTable: (props: unknown) => (
                <SmartDataTable {...props} container={CardComponent} />
              ),
              PivotTable: (props: unknown) => (
                <PivotTable {...props} container={CardComponent} />
              ),
              DataTable: (props: unknown) => (
                <DataTable {...props} container={CardComponent} />
              ),
              StackedBarChart: (props: unknown) => (
                <StackedBarChart {...props} container={CardComponent} />
              ),
              AreaChart: (props: unknown) => (
                <AreaChart {...props} container={CardComponent} />
              ),
              PercentStackedBarChart: (props: unknown) => (
                <PercentStackedBarChart {...props} container={CardComponent} />
              ),
              ClusteredBarChart: (props: unknown) => (
                <ClusteredBarChart {...props} container={CardComponent} />
              ),
              TabSet: DuftTabset,
              Tab: DuftTab,
              PreviewPage,
              JSONVisual,
              Row: DuftGridFullRow,
              TabHeader,
              Tile: DuftTile,
              // DashBoardBody,
              // DashboardRow: DuftRow,
              // Grid: (props: unknown) => <DuftGrid {...props} />, //figure out what this Grid does and if/how we can adapt it to our implementation
              //NB: ability to add design system through state update in dashboard component.
              //Also, how to pass themes to the visual through context.
              Grid: DuftGrid,
              ChartComponent: CardComponent,
              SingleView: DuftSingleView,
              SingleViewHeader: DuftSingleView.Header,
            }}
            jsx={dashboardData}
          />
        ) : (
          <p>Loading dashboard data...</p>
        )
      ) : (
        <p>No ID provided</p>
      )}
    </>
  );
};

export default Dashboard3DL;
