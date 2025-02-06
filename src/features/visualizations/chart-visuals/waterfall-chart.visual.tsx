import { useState } from "react";
import WaterfallChart from "@keyvaluesystems/react-waterfall-chart";
import type { VisualProps } from "../../types/visual-props";
import getInfoTagContents from "../../helpers/get-info-tag-content";
import { useDataContext } from "../context/DataContext";
import EmptyState from "../ui-elements/empty-state";
import ChartSkeleton from "../../ui-components/chart-skeleton";
import WaterFallTooltip from "../../components/waterfall-tooltip";
import { getChartProps } from "../../helpers/waterfall-helpers";

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
  const [tooltip, setTooltip] = useState<string | null>(null);

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

  const handleChartClick = (event: any) => {
    if (!event || !event.value) return;
    setTooltip(`${event.name}: ${event.value}`);
    setTimeout(() => {
      setTooltip(null);
    }, 3000);
  };

  const content = (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        height: "300px",
      }}
    >
      <WaterfallChart
        transactions={data}
        barWidth={barWidth ?? 40}
        summaryXLabel={summaryXLabel ?? "Total"}
        {...getChartProps(waterfallType)}
        styles={{
          positiveBar: {
            fill: positiveBarColor ?? "#4CAF50",
            cursor: "pointer",
          },
          negativeBar: {
            fill: negativeBarColor ?? "#F44336",
            cursor: "pointer",
          },
          summaryBar: { fill: summaryBarColor ?? "#FFC107", cursor: "pointer" },
        }}
        onChartClick={handleChartClick}
      />

      {tooltip && <WaterFallTooltip message={tooltip} />}
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
