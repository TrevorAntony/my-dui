import React from "react";
import { HiHome, HiChartPie, HiHashtag, HiOutlineFolder } from "react-icons/hi";
import SidebarCollapse from "./sidebar-collapse";
import SidebarGroup from "./sidebar-group";
import { SidebarNavLink } from "./sidebar-nav-link";
import { Sidebar } from "flowbite-react";

import type { MenuItem, DataTaskItem, NavigationConfig } from "./types";
import { useSidebarConfigContext } from "../3dl/context/SidebarConfigContext";
import { DataTaskNavLink } from "./data-task-nav-link";

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  "home-icon": HiHome,
  "dashboard-icon": HiChartPie,
  "dashboards-icon": HiChartPie,
  "hashtag-icon": HiHashtag,
};

const renderSidebarMenu = (config: NavigationConfig) => {
  const homeConfig = config.system?.home;
  const systemMenu = config.system?.menu?.items || [];
  const userMenu = config.user?.menu?.items || [];
  const dataTaskMenu = config.system?.dataTasks?.items || [];

  const homeLink = homeConfig ? (
    <Sidebar.ItemGroup key="home-group">
      <SidebarNavLink
        to="/"  // Always use root path for home link
        icon={iconMap[homeConfig.icon] || HiHome}
      >
        {homeConfig.title}
      </SidebarNavLink>
    </Sidebar.ItemGroup>
  ) : null;

  const dataTaskGroup =
    dataTaskMenu.length > 0 ? (
      <SidebarGroup
        key="data-tasks-group"
        title={`${config.system?.dataTasks?.header}` || "actions"}
      >
        {dataTaskMenu.map((item: DataTaskItem, index: number) => {
          const Icon = iconMap[item.icon] || HiChartPie;
          if (
            "tasks" in item &&
            Array.isArray(item.tasks) &&
            item.tasks?.length
          ) {
            return (
              <SidebarCollapse
                key={index}
                icon={HiOutlineFolder}
                label={item.title}
                paths={item.tasks.map((t) => t.task)}
              >
                {item.tasks.map((nestedItem, nestedIndex) => (
                  <DataTaskNavLink
                    key={nestedIndex}
                    task={nestedItem}
                    icon={iconMap[nestedItem.icon] || HiChartPie}
                  />
                ))}
              </SidebarCollapse>
            );
          } else {
            return <DataTaskNavLink key={index} task={item} icon={Icon} />;
          }
        })}
      </SidebarGroup>
    ) : null;

  const systemGroup =
    systemMenu.length > 0 ? (
      <SidebarGroup
        key="system-group"
        // title="dashboards"
        title={`${config.system?.menu?.header}` || "dashboards"}
      >
        {systemMenu.map((item: MenuItem, index: number) => {
          const Icon = iconMap[item.icon] || HiChartPie;
          if (
            "dashboards" in item &&
            Array.isArray(item.dashboards) &&
            item.dashboards?.length
          ) {
            return (
              <SidebarCollapse
                key={index}
                icon={HiOutlineFolder}
                label={item.title}
                paths={item.dashboards.map((d) => d.dashboard)}
              >
                {item.dashboards.map((nestedItem, nestedIndex) => (
                  <div key={nestedIndex} className="pl-2">
                    <SidebarNavLink
                      to={nestedItem.dashboard}
                      icon={iconMap[nestedItem.icon] || HiChartPie}
                    >
                      {nestedItem.title}
                    </SidebarNavLink>
                  </div>
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

  const userGroup =
    userMenu.length > 0 ? (
      <SidebarGroup
        key="user-group"
        title={`${config.user?.menu?.header}` || "user dashboards"}
      >
        {userMenu.map((item: MenuItem, index: number) => {
          const Icon = iconMap[item.icon] || HiChartPie;
          if (
            "dashboards" in item &&
            Array.isArray(item.dashboards) &&
            item.dashboards?.length
          ) {
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
  const sidebarConfig = useSidebarConfigContext();

  return <>{renderSidebarMenu(sidebarConfig)}</>;
};

export default SystemSidebar;
