import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JSXParser from "react-jsx-parser";
import { fetchDataWithoutStore } from "../api/api";
import CardComponent from "../components/card-component";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../ui-components/error-fallback";

import {
  Dashboard,
  Filters,
  Filter,
  Dataset,
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
  CascadeChart,
  SmartDataTable,
  ScoreCardTable,
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
  DetailsView,
  PreviewQuery,
  SingleLayout,
  QueryProvider,
  Query,
  InfiniteScrollTable,
  ExportData,
} from "../3dl";
import {
  DuftGrid,
  DuftGridFullRow,
  DuftGridHeader,
  DuftSubheader,
} from "../ui-components/grid-components";
import useDuftQuery from "./resources/useDuftQuery";
import { DuftTabset, DuftTab } from "../ui-components/tab-components";
import DuftTile from "../components/duft-tile";
import DuftFilter from "../ui-components/filter-components";
import DuftSingleView from "../ui-components/table-components";
import DuftModal from "../components/duft-modal";
import type { ContainerComponentProps } from "../3dl/types/types";
import SingleTableLayoutTester from "../content-components/SingleTableLayoutTester";
import DataString from "../components/dashboard-meta";

const useDashboardData = (id: string) => {
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
  //split logic in this component.
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
              QueryProvider,
              SingleLayout,
              Header: DuftGridHeader,
              Subheader: DuftSubheader,
              Filters,
              Filter: DuftFilter,
              Query,
              Visual1,
              Visual3,
              Visual4,
              Visual5,
              DataString,
              Section,
              Dataset: (props: unknown) => (
                <Dataset {...props} useQuery={useDuftQuery} />
              ),
              PieChart: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <PieChart {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              DonutChart: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <DonutChart {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              RadialBarChart: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <RadialBarChart {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              PolarAreaChart: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <PolarAreaChart {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              BarChart: (props: React.ComponentProps<typeof BarChart>) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <BarChart
                    {...(props as React.ComponentProps<typeof AreaChart>)}
                    container={
                      CardComponent as React.ComponentType<ContainerComponentProps>
                    }
                  />
                </ErrorBoundary>
              ),
              LineChart: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <LineChart {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              HeatmapChart: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <HeatmapChart {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              RadarChart: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <RadarChart {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              CascadeChart: (
                props: React.ComponentProps<typeof CascadeChart>,
              ) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <CascadeChart
                    {...(props as React.ComponentProps<typeof CascadeChart>)}
                    container={
                      CardComponent as React.ComponentType<ContainerComponentProps>
                    }
                  />
                </ErrorBoundary>
              ),
              SmartDataTable: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <SmartDataTable {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              ScoreCardTable: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <ScoreCardTable {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              PivotTable: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <PivotTable {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              DataTable: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <DataTable {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              InfiniteScrollTable: (props: unknown) => (
                <InfiniteScrollTable
                  {...(props as Record<string, unknown>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                  modal={DuftModal as React.ComponentType<unknown>}
                />
              ),
              StackedBarChart: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <StackedBarChart {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              AreaChart: (props: React.ComponentProps<typeof AreaChart>) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <AreaChart
                    {...(props as React.ComponentProps<typeof AreaChart>)}
                    container={
                      CardComponent as React.ComponentType<ContainerComponentProps>
                    }
                  />
                </ErrorBoundary>
              ),
              PercentStackedBarChart: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <PercentStackedBarChart
                    {...props}
                    container={CardComponent}
                  />
                </ErrorBoundary>
              ),
              ClusteredBarChart: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <ClusteredBarChart {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              PreviewQuery: (props: unknown) => (
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <PreviewQuery {...props} container={CardComponent} />
                </ErrorBoundary>
              ),
              TabSet: DuftTabset,
              Tab: DuftTab,
              PreviewPage,
              JSONVisual,
              Row: DuftGridFullRow,
              TabHeader,
              Tile: DuftTile,
              DetailsView,
              Grid: DuftGrid,
              ChartComponent: CardComponent,
              SingleView: DuftSingleView,
              SingleViewHeader: DuftSingleView.Header,
              ExportData,
              SingleTableLayoutTester,
            }}
            jsx={dashboardData}
          />
        ) : (
          <p>Error on loading dashboard data</p>
        )
      ) : (
        <p>No ID provided</p>
      )}
    </>
  );
};

export default Dashboard3DL;
