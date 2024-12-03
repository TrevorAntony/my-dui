export interface DashboardItem {
  title: string;
  icon: string;
  dashboard: string;
}

export interface DashboardGroupItem {
  title: string;
  icon: string;
  dashboards: DashboardItem[];
  dashboard: string;
}

export type MenuItem = DashboardItem | DashboardGroupItem;

export interface DataTaskItem {
  title: string;
  icon: string;
  task: string;
  dashboard: string;
}

export interface SystemConfig {
  settings?: {
    appName: string;
    footer: string;
  };
  home?: DashboardItem;
  menu?: {
    header?: string;
    items?: MenuItem[];
  };
  dataTasks?: {
    header?: string;
    items?: DataTaskItem[];
  };
}

export interface UserConfig {
  home?: DashboardItem;
  menu?: {
    header?: string;
    items?: MenuItem[];
  };
  dataTasks?: {
    header?: string;
    items?: DataTaskItem[];
  };
}

export interface NavigationConfig {
  system?: SystemConfig;
  user?: UserConfig;
}
