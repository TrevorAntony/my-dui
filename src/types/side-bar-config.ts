import type { DataTask } from "./data-task";
import type { MenuItem } from "../components/types";

export type SidebarConfig = {
  system: {
    home: {
      title: string;
      icon: string;
      dashboard: string;
    };
    menu: MenuItem[];
    dataTasks: DataTask[];
  };
  user: {
    menu: MenuItem[];
  };
};
