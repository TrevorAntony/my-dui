import type { SidebarConfig } from "../types/side-bar-config";

export const defaultSidebarConfig: SidebarConfig = {
  system: {
    home: {
      title: "Home",
      icon: "home-icon",
      dashboard: "/",
    },
    menu: [],
    dataTasks: [],
  },
  user: {
    menu: [],
  },
};
