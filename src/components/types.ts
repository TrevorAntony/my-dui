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
  home?: DashboardItem;
  menu?: MenuItem[];
  dataTasks?: DataTaskItem[];
}

export interface UserConfig {
  home?: DashboardItem;
  menu?: MenuItem[];
  dataTasks?: DataTaskItem[];
}

export interface NavigationConfig {
  system?: SystemConfig;
  user?: UserConfig;
}
