export type WaterfallType = "standard" | "cumulative" | "bridged" | "minimal";

export const getChartProps = (waterfallType: WaterfallType) => {
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
