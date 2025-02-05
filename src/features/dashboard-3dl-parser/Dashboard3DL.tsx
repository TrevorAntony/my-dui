import { useParams } from "react-router-dom";
import JSXParser from "react-jsx-parser";
import CardComponent from "../../features/visualizations/visual-utils/card-component/card-component";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../features/visualizations/visual-utils/error-fallback-component/error-fallback";
import DuftMultiSelectFilter from "../../features/visualizations/filters/multi-select-filter-component";
import {
  Dashboard,
  Filters,
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
  ScoreCardTable,
  DataTable,
  PreviewPage,
  PivotTable,
  JSONVisual,
  TabHeader,
  StackedBarChart,
  PercentStackedBarChart,
  ClusteredBarChart,
  ClusteredLineChart,
  DetailsView,
  DetailsView2,
  PreviewQuery,
  SingleLayout,
  QueryProvider,
  Query,
  InfiniteScrollTable,
  ExportData,
  Markdown,
  InfoTag,
  HtmlSnippet,
  DataProvider,
  QueryData,
  ServerQueryData,
  ApiData,
  OpenmrsData,
  StaticData,
} from ".";
import {
  DuftGrid,
  DuftGridFullRow,
  DuftGridHeader,
  DuftSubheader,
} from "../../features/visualizations/layout-components/grid-components";
import useDuftQuery from "../../features/data-components/hooks/useDuftQuery";
import {
  DuftTabset,
  DuftTab,
} from "../../features/visualizations/tabs/tab-components";
import DuftTile from "../../features/visualizations/duft-overrides/duft-tile";
import DuftFilter from "../../features/visualizations/filters/duft-filter";
import DuftSingleView from "../../_playground/_ui-components/table-components";
import DuftModal from "../../features/visualizations/visual-utils/modals/duft-modal";
import CascadeNode from "../../features/visualizations/chart-visuals/cascade-chart/cascade-components/cascade-node";
import type { ContainerComponentProps } from "../../features/visualizations/types/types";
import SingleTableLayoutTester from "../../_playground/_content-components/SingleTableLayoutTester";
import DataString from "../../utils/dashboard-meta";
import useDashboardData from "../../features/dashboard-3dl-parser/hooks/useDashboardData";
import useThemeData from "../../features/dashboard-3dl-parser/hooks/useTheme";
import useQueryData from "../../features/data-components/hooks/useQueryData";
import { client } from "../../core/api/DuftHttpClient/local-storage-functions";
import { openmrsClient } from "../../core/api/OpenmrsHttpClient/OpenmrsHttpClient";

interface Dashboard3DLProps {
  defaultId?: string;
}

const Dashboard3DL: React.FC<Dashboard3DLProps> = ({
  defaultId,
}: {
  defaultId: string;
}) => {
  const { id: routeId } = useParams();
  // Extract the ID from either route params, defaultId prop, or fallback to 'home'
  const id = routeId || defaultId || "home";
  const dashboardData = useDashboardData(id);
  const { themeData } = useThemeData();

  return (
    <>
      {dashboardData ? (
        // @ts-expect-error: JSXParser allows multiple props, but expects specific props.
        <JSXParser
          components={{
            Dashboard: (props: React.ComponentProps<typeof Dashboard>) => (
              <Dashboard
                {...(props as React.ComponentProps<typeof Dashboard>)}
                theme={themeData}
              />
            ),
            QueryProvider,
            SingleLayout,
            Header: DuftGridHeader,
            Subheader: DuftSubheader,
            Filters,
            Filter: DuftFilter,
            MultiSelectFilter: DuftMultiSelectFilter,
            Query,
            Visual1,
            Visual3,
            Visual4,
            Visual5,
            DataString,
            Section,
            DataProvider,
            Dataset: (props: React.ComponentProps<typeof Dataset>) => (
              <Dataset
                {...(props as React.ComponentProps<typeof Dataset>)}
                useQuery={useDuftQuery}
              />
            ),
            StaticData: (props: React.ComponentProps<typeof StaticData>) => (
              <StaticData
                {...(props as React.ComponentProps<typeof StaticData>)}
              />
            ),
            QueryData: (props: React.ComponentProps<typeof QueryData>) => (
              <QueryData
                {...(props as React.ComponentProps<typeof QueryData>)}
                useQuery={useQueryData}
                client={client}
              />
            ),
            ApiData: (props: React.ComponentProps<typeof ApiData>) => (
              <ApiData
                {...(props as React.ComponentProps<typeof ApiData>)}
                client={client}
                queryKey={[
                  "dashboard",
                  props.url,
                  JSON.stringify(props.params || {}),
                ].filter(Boolean)}
              />
            ),
            ServerQueryData: (
              props: React.ComponentProps<typeof ServerQueryData>
            ) => (
              <ServerQueryData
                {...(props as React.ComponentProps<typeof ServerQueryData>)}
                useQuery={useQueryData}
                client={client}
              />
            ),
            OpenmrsData: (props: React.ComponentProps<typeof OpenmrsData>) => (
              <OpenmrsData
                {...(props as React.ComponentProps<typeof OpenmrsData>)}
                client={openmrsClient}
              />
            ),
            PieChart: (props: React.ComponentProps<typeof PieChart>) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <PieChart
                  {...(props as React.ComponentProps<typeof PieChart>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            DonutChart: (props: React.ComponentProps<typeof DonutChart>) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <DonutChart
                  {...(props as React.ComponentProps<typeof DonutChart>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            RadialBarChart: (
              props: React.ComponentProps<typeof RadialBarChart>
            ) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <RadialBarChart
                  {...(props as React.ComponentProps<typeof RadialBarChart>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            PolarAreaChart: (
              props: React.ComponentProps<typeof PolarAreaChart>
            ) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <PolarAreaChart
                  {...(props as React.ComponentProps<typeof PolarAreaChart>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            BarChart: (props: React.ComponentProps<typeof BarChart>) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <BarChart
                  {...(props as React.ComponentProps<typeof BarChart>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            LineChart: (props: React.ComponentProps<typeof LineChart>) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <LineChart
                  {...(props as React.ComponentProps<typeof LineChart>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            HeatmapChart: (
              props: React.ComponentProps<typeof HeatmapChart>
            ) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <HeatmapChart
                  {...(props as React.ComponentProps<typeof HeatmapChart>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            RadarChart: (props: React.ComponentProps<typeof RadarChart>) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <RadarChart
                  {...(props as React.ComponentProps<typeof RadarChart>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            CascadeChart: (
              props: React.ComponentProps<typeof CascadeChart>
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
            ScoreCardTable: (
              props: React.ComponentProps<typeof ScoreCardTable>
            ) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <ScoreCardTable
                  {...(props as React.ComponentProps<typeof ScoreCardTable>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            PivotTable: (props: React.ComponentProps<typeof PivotTable>) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <PivotTable
                  {...(props as React.ComponentProps<typeof PivotTable>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            DataTable: (props: React.ComponentProps<typeof DataTable>) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <DataTable
                  {...(props as React.ComponentProps<typeof DataTable>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            InfiniteScrollTable: (
              props: React.ComponentProps<typeof InfiniteScrollTable>
            ) => (
              <InfiniteScrollTable
                {...(props as React.ComponentProps<typeof InfiniteScrollTable>)}
                container={
                  CardComponent as React.ComponentType<ContainerComponentProps>
                }
                modal={DuftModal as React.ComponentType<unknown>}
              />
            ),
            StackedBarChart: (
              props: React.ComponentProps<typeof StackedBarChart>
            ) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <StackedBarChart
                  {...(props as React.ComponentProps<typeof StackedBarChart>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
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
            PercentStackedBarChart: (
              props: React.ComponentProps<typeof PercentStackedBarChart>
            ) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <PercentStackedBarChart
                  {...(props as React.ComponentProps<
                    typeof PercentStackedBarChart
                  >)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            ClusteredLineChart: (
              props: React.ComponentProps<typeof ClusteredLineChart>
            ) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <ClusteredLineChart
                  {...(props as React.ComponentProps<
                    typeof ClusteredLineChart
                  >)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            ClusteredBarChart: (
              props: React.ComponentProps<typeof ClusteredBarChart>
            ) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <ClusteredBarChart
                  {...(props as React.ComponentProps<typeof ClusteredBarChart>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            PreviewQuery: (
              props: React.ComponentProps<typeof PreviewQuery>
            ) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <PreviewQuery
                  {...(props as React.ComponentProps<typeof PreviewQuery>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            TabSet: DuftTabset,
            Tab: DuftTab,
            PreviewPage,
            CascadeNode,
            JSONVisual,
            Row: DuftGridFullRow,
            TabHeader,
            Tile: DuftTile,
            DetailsView,
            DetailsView2,
            Grid: DuftGrid,
            //Do we need this??
            // ChartComponent: CardComponent,
            SingleView: DuftSingleView,
            SingleViewHeader: DuftSingleView.Header,
            ExportData,
            SingleTableLayoutTester,
            Markdown: (props: React.ComponentProps<typeof Markdown>) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Markdown
                  {...(props as React.ComponentProps<typeof Markdown>)}
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            HtmlSnippet: (props: React.ComponentProps<typeof HtmlSnippet>) => (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <HtmlSnippet
                  {...(props as React.ComponentProps<typeof HtmlSnippet>)}
                  //@ts-ignore will refactor types for this
                  container={
                    CardComponent as React.ComponentType<ContainerComponentProps>
                  }
                />
              </ErrorBoundary>
            ),
            InfoTag,
          }}
          jsx={dashboardData}
        />
      ) : (
        <p>Error loading dashboard data</p>
      )}
    </>
  );
};

export default Dashboard3DL;
