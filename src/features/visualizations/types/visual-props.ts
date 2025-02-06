<<<<<<< HEAD:src/types/visual-props.ts
import type { ContainerComponentProps } from "../3dl/types/types";
import type { cascadeScaleMap } from "../helpers/constants";
import type { WaterfallType } from "../helpers/waterfall-helpers";
=======
import type { ContainerComponentProps } from "./types";
import type { cascadeScaleMap } from "../../../utils/constants";
>>>>>>> a37cd99e032853681a90a00f8cf2d1bdfff75ae5:src/features/visualizations/types/visual-props.ts
export interface VisualProps {
  container?: React.ComponentType<ContainerComponentProps>;
  header?: string;
  subHeader?: string;
  exportData?: string;
  detailsComponent?: string;
  userOptions?: Record<string, unknown>;
  tableMaxHeight?: string;
  showToolbar?: boolean | string;
  nodeWidth?: number | string;
  nodeHeight?: number | string;
  cascadeScale?: keyof typeof cascadeScaleMap;
  cascadeSearchColumn?: string;
  direction?: string;
  resize?: string;
  modalWidth?: "narrow" | "medium" | "wide";
  modalHeight?: "tiny" | "smaller" | "small" | "medium" | "large";
  children?: React.ReactNode;
  infoTagContent?: React.ReactNode;
  DataStringQuery?: string;
  waterfallOptions?: WaterfallOptions;
  waterfallType?: WaterfallType;
}

interface WaterfallOptions {
  summaryXLabel?: string;
  barWidth?: number;
  positiveBarColor?: string;
  negativeBarColor?: string;
  summaryBarColor?: string;
}