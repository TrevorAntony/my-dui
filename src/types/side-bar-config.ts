import type { DataTask } from "./data-task";

export type SidebarConfig = {
  system: {
    home: {
      title: string;
      icon: string;
      dashboard: string;
    };
    menu: string[];
    dataTasks: DataTask[];
  };
  user: {
    menu: string[];
  };
};
