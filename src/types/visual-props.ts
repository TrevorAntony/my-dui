import type { ContainerComponentProps } from "../3dl/types/types";
export interface VisualProps {
  container?: React.ComponentType<ContainerComponentProps>;
  header?: string;
  subHeader?: string;
  exportData?: string;
  detailsComponent?: string;
  userOptions?: Record<string, unknown>;
  tableMaxHeight?: string;
  showToolbar?: boolean | string;
  cascadeObject?: Record<string, unknown>;
  nodeWidth?: number | string;
  nodeHeight?: number | string;
  direction?: string;
  resize?: string;
  modalWidth?: "narrow" | "medium" | "wide";
  modalHeight?: "tiny" | "smaller" | "small" | "medium" | "large";
  children?: React.ReactNode;
  infoTagContent?: React.ReactNode;
}
