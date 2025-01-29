import Chart from "react-apexcharts";
import { useThemeContext } from "../utilities/Dashboard";
import { useDataContext } from "../context/DataContext";
import { deepCopy, deepMerge } from "../../helpers/visual-helpers";
import EmptyState from "../ui-elements/empty-state";
import ChartSkeleton from "../../ui-components/chart-skeleton";
import type { VisualProps } from "../../types/visual-props";
type DataItem = {
  category?: string;
  value?: number;
  [key: string]: unknown;
};
const ClusteredLineChart = ({
  container: Container,
  header,
  subHeader = "",
  userOptions = {},
  exportData,
  detailsComponent,
  resize,
  ...props
}: VisualProps) => {
  const theme = useThemeContext();
  const { data, loading } = useDataContext();
  console.log("Cluster: ", data)

  if (loading) {
    return <ChartSkeleton />;
  }

  if (!data || !Array.isArray(data) || !data.length) {
    const content = (
      <EmptyState message="No data available for clustered line chart" />
    );
    return Container ? (
      <Container header={""} {...props}>
        {content}
      </Container>
    ) : (
      content
    );
  }

  const categories = (data as DataItem[]).map((item) => item.category);
  const seriesNames = Object.keys(data[0]).filter((key) => key !== "category");
  const series = seriesNames.map((name) => ({
    name,
    data: data.map((item) => item[name]),
  }));
  const { apex: apexOptions } = theme["themes"][0];
  const options = {
    chart: {
      type: "line",
    },
    stroke: {
      width: 3,
    },
    xaxis: {
      categories: categories,
    },
    tooltip: {
      y: {
        formatter: (val) => val,
      },
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
    ],
    fill: {
      opacity: 1,
    },
    legend: {
      position: "bottom",
    },
    colors: ["#00E396", "#FF4560", "#775DD0", "#FEB019"],
  };
  let mergedOptions = deepMerge(deepCopy(options), deepCopy(apexOptions));
  mergedOptions = deepMerge(mergedOptions, userOptions);
  const content = (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "300px",
        overflow: "hidden",
      }}
    >
      <Chart
        options={mergedOptions}
        series={series}
        type="line"
        height={"100%"}
      />
    </div>
  );
  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
      resize={resize}
    >
      {content}
    </Container>
  ) : (
    content
  );
};
export default ClusteredLineChart;