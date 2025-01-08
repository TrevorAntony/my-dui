/* eslint-disable @typescript-eslint/no-explicit-any */

export type CascadeContent = {
  label: string;
  value: number;
  nodeId: string;
  query: string;
};

export type CascadeColorOptions = {
  nodeBGColorHover?: string;
  borderColorHover?: string;
  nodeBGColor?: string;
};

export type Cascade = {
  id: string;
  parentId: string;
  data: CascadeContent;
  options?: CascadeColorOptions;
  children?: Cascade[];
};

export type CascadeNodeProps = {
  id?: string;
  parentId?: string;
  label?: string;
  data?: { value: number }[];
  options?: {
    nodeBGColorHover?: string;
    borderColorHover?: string;
    nodeBGColor?: string;
  };
  detailsViewQuery?: string;
  children?: React.ReactNode;
};

export type CascadeChartProps = {
  children?: React.ReactNode;
};
