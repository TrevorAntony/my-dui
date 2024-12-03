import Chart from "react-apexcharts";
import { useThemeContext } from "../utilities/Dashboard"; // Importing the theme context
import { useDataContext } from "../context/DataContext";
import { deepCopy, deepMerge } from "../../helpers/visual-helpers"; // Importing deepCopy and deepMerge
import EmptyState from "../ui-elements/empty-state";
import type { VisualProps } from "../../types/visual-props";
import getInfoTagContents from "../../helpers/get-info-tag-content";
import ChartSkeleton from "../../ui-components/chart-skeleton";

type DataItem = {
  category?: string;
  value?: number;
  [key: string]: unknown;
};

const PercentStackedBarChart = ({
  container: Container,
  header,
  subHeader = "",
  userOptions = {},
  exportData,
  detailsComponent,
  resize,
  children,
  ...props
}: VisualProps) => {
  const theme = useThemeContext(); // Accessing the theme context
  const { data, loading } = useDataContext();

  if (loading) {
    return <ChartSkeleton />;
  }

  if (!loading && Array.isArray(data) && data.length === 0) {
    const content = (
      <EmptyState message="No data available for percent stacked bar chart" />
    );
    return Container ? (
      <Container header={""} {...props}>
        {content}
      </Container>
    ) : (
      content
    );
  }
  if (!data) {
    return null;
  }

  // Extract categories
  const categories = (data as DataItem[]).map((item) => item.category);

  // Extract series data
  const seriesNames = Object?.keys(data[0]).filter((key) => key !== "category");
  const series = seriesNames.map((name) => ({
    name,
    data: data.map((item) => item[name]),
  }));

  const { apex: apexOptions } = theme["themes"][0];

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      stackType: "100%", // Setting the stack type to 100%
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
      },
    },
    colors: ["#00E396", "#FF4560", "#775DD0", "#FEB019"],
    stroke: {
      show: true,
      width: 1,
      colors: ["#fff"],
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
        breakpoint: 1000, // Adjust the breakpoint as necessary
        options: {
          chart: {
            width: "100%", // Set to 100% width below the breakpoint
          },
        },
      },
    ],
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
    },
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
        type="bar"
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
      infoTagContent={getInfoTagContents(children)}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default PercentStackedBarChart;
