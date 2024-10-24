/* eslint-disable @typescript-eslint/no-explicit-any */
export type Cascade = {
  id: string;
  options?: any;
  data: any;
  children?: any;
};

//  TO-DO: Revert to the type below

// export type CascadeData = {
//   label: string;
//   query: string;
// };

// export type CascadeOptions = {
//   nodeBGColorHover?: string;
//   borderColorHover?: string;
//   nodeBGColor?: string;
// };

// export type Cascade = {
//   id: string;
//   data: CascadeData;
//   options?: CascadeOptions;
//   children?: Cascade[];
// };
