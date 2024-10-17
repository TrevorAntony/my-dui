import React, { useEffect, useState } from "react";
import { HiHome, HiChartPie, HiHashtag, HiOutlineFolder } from "react-icons/hi";
import SidebarCollapse from "./sidebar-collapse";
import SidebarGroup from "./sidebar-group";
import { SidebarNavLink } from "./sidebar-nav-link";
import { fetchDataWithoutStore } from "../api/api";
import { Sidebar } from "flowbite-react";

// Mapping of icon names to actual SVG components
const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  "home-icon": HiHome,
  "dashboard-icon": HiChartPie,
  "dashboards-icon": HiChartPie,
  "hashtag-icon": HiHashtag,
};

// Default configuration as a fallback
const defaultSidebarConfig: NavigationConfig = {
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

// Type Definitions
interface DashboardItem {
  title: string;
  icon: string;
  dashboard: string;
}

interface DashboardGroupItem {
  title: string;
  icon: string;
  dashboards: DashboardItem[];
  dashboard: string;
}

type MenuItem = DashboardItem | DashboardGroupItem;

interface DataTaskItem {
  title: string;
  icon: string;
  task: string;
  dashboard: string;
}

interface SystemConfig {
  home?: DashboardItem;
  menu?: MenuItem[];
  dataTasks?: DataTaskItem[];
}

interface UserConfig {
  home?: DashboardItem;
  menu?: MenuItem[];
  dataTasks?: DataTaskItem[];
}

interface NavigationConfig {
  system?: SystemConfig;
  user?: UserConfig;
}

const renderSidebarMenu = (config: NavigationConfig) => {
  const homeConfig = config.system?.home;
  const systemMenu = config.system?.menu || [];
  const userMenu = config.user?.menu || [];
  const dataTaskMenu = config.system?.dataTasks || [];

  // Render Home link inside Sidebar.ItemGroup
  const homeLink = homeConfig ? (
    <Sidebar.ItemGroup key="home-group">
      <SidebarNavLink
        to={homeConfig.dashboard}
        icon={iconMap[homeConfig.icon] || HiHome}
      >
        {homeConfig.title}
      </SidebarNavLink>
    </Sidebar.ItemGroup>
  ) : null;

  // Render the Data Task group
  const dataTaskGroup =
    dataTaskMenu.length > 0 ? (
      <SidebarGroup key="data-tasks-group" title="Actions">
        {dataTaskMenu.map((item: DataTaskItem, index: number) => {
          const Icon = iconMap[item.icon] || HiChartPie;
          return (
            <SidebarNavLink
              key={index}
              to={`/data-task/${item.task}`}
              icon={Icon}
            >
              {item.title}
            </SidebarNavLink>
          );
        })}
      </SidebarGroup>
    ) : null;

  // Render the System group
  const systemGroup =
    systemMenu.length > 0 ? (
      <SidebarGroup key="system-group" title="dashboards">
        {systemMenu.map((item: MenuItem, index: number) => {
          const Icon = iconMap[item.icon] || HiChartPie;
          if ("dashboards" in item && Array.isArray(item.dashboards)) {
            // item is DashboardGroupItem
            return (
              <SidebarCollapse
                key={index}
                icon={HiOutlineFolder}
                label={item.title}
                paths={item.dashboards.map((d) => d.dashboard)}
              >
                {item.dashboards.map((nestedItem, nestedIndex) => (
                  <SidebarNavLink
                    key={nestedIndex}
                    to={nestedItem.dashboard}
                    icon={iconMap[nestedItem.icon] || HiChartPie}
                  >
                    {nestedItem.title}
                  </SidebarNavLink>
                ))}
              </SidebarCollapse>
            );
          } else {
            // item is DashboardItem
            return (
              <SidebarNavLink key={index} to={item.dashboard} icon={Icon}>
                {item.title}
              </SidebarNavLink>
            );
          }
        })}
      </SidebarGroup>
    ) : null;

  // Render the User group
  const userGroup =
    userMenu.length > 0 ? (
      <SidebarGroup key="user-group" title="User">
        {userMenu.map((item: MenuItem, index: number) => {
          const Icon = iconMap[item.icon] || HiChartPie;
          if ("dashboards" in item && Array.isArray(item.dashboards)) {
            return (
              <SidebarCollapse
                key={index}
                icon={Icon}
                label={item.title}
                paths={item.dashboards.map((d) => d.dashboard)}
              >
                {item.dashboards.map((nestedItem, nestedIndex) => (
                  <SidebarNavLink
                    key={nestedIndex}
                    to={nestedItem.dashboard}
                    icon={iconMap[nestedItem.icon] || HiChartPie}
                  >
                    {nestedItem.title}
                  </SidebarNavLink>
                ))}
              </SidebarCollapse>
            );
          } else {
            return (
              <SidebarNavLink key={index} to={item.dashboard} icon={Icon}>
                {item.title}
              </SidebarNavLink>
            );
          }
        })}
      </SidebarGroup>
    ) : null;

  return (
    <>
      {homeLink}
      {systemGroup}
      {userGroup}
      {dataTaskGroup}
    </>
  );
};

const SystemSidebar = () => {
  const [sidebarConfig, setSidebarConfig] =
    useState<NavigationConfig>(defaultSidebarConfig);

  useEffect(() => {
    const loadSidebarConfig = async () => {
      try {
        const config: NavigationConfig = await fetchDataWithoutStore(
          "/navigation"
        );
        setSidebarConfig(config || defaultSidebarConfig);
      } catch (error) {
        console.error("Failed to load sidebar config", error);
        setSidebarConfig(defaultSidebarConfig);
      }
    };

    loadSidebarConfig();
  }, []);

  return <>{renderSidebarMenu(sidebarConfig)}</>;
};

export default SystemSidebar;
