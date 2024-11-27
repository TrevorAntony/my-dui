import { useParams } from "react-router-dom";
import JSXParser from "react-jsx-parser";
import CardComponent from "../components/card-component";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../ui-components/error-fallback";

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
  DetailsView,
  PreviewQuery,
  SingleLayout,
  QueryProvider,
  Query,
  InfiniteScrollTable,
  ExportData,
  Markdown,
  InfoTag,
  HtmlSnippet,
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
import useDashboardData from "./resources/useDashboardData";
import useThemeData from "./resources/useTheme";

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
            Query,
            Visual1,
            Visual3,
            Visual4,
            Visual5,
            DataString,
            Section,
            Dataset: (props: React.ComponentProps<typeof Dataset>) => (
              <Dataset
                {...(props as React.ComponentProps<typeof Dataset>)}
                useQuery={useDuftQuery}
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
              props: React.ComponentProps<typeof RadialBarChart>,
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
              props: React.ComponentProps<typeof PolarAreaChart>,
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
              props: React.ComponentProps<typeof HeatmapChart>,
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
            ScoreCardTable: (
              props: React.ComponentProps<typeof ScoreCardTable>,
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
              props: React.ComponentProps<typeof InfiniteScrollTable>,
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
              props: React.ComponentProps<typeof StackedBarChart>,
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
              props: React.ComponentProps<typeof PercentStackedBarChart>,
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
            ClusteredBarChart: (
              props: React.ComponentProps<typeof ClusteredBarChart>,
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
              props: React.ComponentProps<typeof PreviewQuery>,
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
                  //@ts-expect-error This error comes from mismatch between html snippet and the card component. Will discuss and update with Fitti.
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
