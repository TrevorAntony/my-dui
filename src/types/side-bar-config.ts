import type { DataTaskItem, MenuItem } from "../components/types";

export type SidebarConfig = {
  system: {
    home: {
      title: string;
      icon: string;
      dashboard: string;
    };
    menu?: {
      header?: string;
      items?: MenuItem[];
    };
    dataTasks?: {
      header?: string;
      items?: DataTaskItem[];
    };
  };
  user: {
    menu?: {
      header?: string;
      items?: MenuItem[];
    };
  };
};
