import WaterfallChart from "@keyvaluesystems/react-waterfall-chart";
import type { VisualProps } from "../../types/visual-props";
import getInfoTagContents from "../../helpers/get-info-tag-content";
import { useDataContext } from "../context/DataContext";
import EmptyState from "../ui-elements/empty-state";
import ChartSkeleton from "../../ui-components/chart-skeleton";

const WaterFallChart = ({
  container: Container,
  header = "Waterfall Chart",
  subHeader = "",
  exportData,
  detailsComponent,
  children,
  DataStringQuery,
  waterfallType = "cumulative",
  waterfallOptions = {},
  ...props
}: VisualProps) => {
  const { data, loading } = useDataContext();

  const {
    summaryXLabel,
    barWidth,
    positiveBarColor,
    negativeBarColor,
    summaryBarColor,
  } = waterfallOptions;

  if (loading) {
    return <ChartSkeleton />;
  }

  if (!loading && Array.isArray(data) && data.length === 0) {
    const content = (
      <EmptyState message="No data available for waterfall chart" />
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

  const getChartProps = () => {
    switch (waterfallType) {
      case "cumulative":
        return {
          showFinalSummary: true,
          showBridgeLines: false,
          showYAxisScaleLines: true,
        };
      case "bridged":
        return {
          showFinalSummary: true,
          showBridgeLines: true,
          showYAxisScaleLines: true,
        };
      case "minimal":
        return {
          showFinalSummary: false,
          showBridgeLines: false,
          showYAxisScaleLines: false,
        };
      case "standard":
      default:
        return {
          showFinalSummary: false,
          showBridgeLines: false,
          showYAxisScaleLines: true,
        };
    }
  };

  const content = (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "300px",
      }}
    >
      <WaterfallChart
        transactions={data}
        barWidth={barWidth ?? 40}
        summaryXLabel={summaryXLabel ?? "Total"}
        {...getChartProps()}
        styles={{
          positiveBar: { fill: positiveBarColor ?? "#4CAF50" },
          negativeBar: { fill: negativeBarColor ?? "#F44336" },
          summaryBar: { fill: summaryBarColor ?? "#FFC107" },
        }}
      />
    </div>
  );

  return Container ? (
    <Container
      header={header}
      subHeader={subHeader}
      exportData={exportData}
      detailsComponent={detailsComponent}
      infoTagContent={getInfoTagContents(children)}
      DataStringQuery={DataStringQuery}
    >
      {content}
    </Container>
  ) : (
    content
  );
};

export default WaterFallChart;
