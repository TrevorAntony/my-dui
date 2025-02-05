import type { ContainerComponentProps } from "./types";
import type { cascadeScaleMap } from "../../../utils/constants";
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
}
