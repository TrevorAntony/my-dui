import React from "react";
import { HiHome, HiChartPie, HiHashtag, HiOutlineFolder } from "react-icons/hi";
import SidebarCollapse from "./sidebar-collapse";
import SidebarGroup from "./sidebar-group";
import { SidebarNavLink } from "./SidebarNavLink";
import { Sidebar } from "flowbite-react";
import { useSidebarConfig } from "../hooks/useSideBarConfig";

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  "home-icon": HiHome,
  "dashboard-icon": HiChartPie,
  "dashboards-icon": HiChartPie,
  "hashtag-icon": HiHashtag,
};

const renderSidebarMenu = (config: any) => {
  const homeConfig = config.system?.home;
  const systemMenu = config.system?.menu || [];
  const userMenu = config.user?.menu || [];
  const dataTaskMenu = config.system?.dataTasks || [];

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

  const dataTaskGroup =
    dataTaskMenu.length > 0 ? (
      <SidebarGroup key="data-tasks-group" title="Actions">
        {dataTaskMenu.map((item: any, index: number) => {
          const Icon = iconMap[item.icon] || HiChartPie;
          if (item.dashboards && item.dashboards.length > 0) {
            return (
              <SidebarCollapse
                key={index}
                icon={HiOutlineFolder}
                label={item.title}
                paths={item.dashboards.map((d: any) => d.dashboard)}
              >
                {item.dashboards.map((nestedItem: any, nestedIndex: number) => (
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
              <SidebarNavLink
                key={index}
                to={`/data-task/${item.task}`}
                icon={Icon}
              >
                {item.title}
              </SidebarNavLink>
            );
          }
        })}
      </SidebarGroup>
    ) : null;

  const systemGroup =
    systemMenu.length > 0 ? (
      <SidebarGroup key="system-group" title="dashboards">
        {systemMenu.map((item: any, index: number) => {
          const Icon = iconMap[item.icon] || HiChartPie;
          if (item.dashboards && item.dashboards.length > 0) {
            return (
              <SidebarCollapse
                key={index}
                icon={HiOutlineFolder}
                label={item.title}
                paths={item.dashboards.map((d: any) => d.dashboard)}
              >
                {item.dashboards.map((nestedItem: any, nestedIndex: number) => (
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

  const userGroup =
    userMenu.length > 0 ? (
      <SidebarGroup key="user-group" title="User">
        {userMenu.map((item: any, index: number) => {
          const Icon = iconMap[item.icon] || HiChartPie;
          if (item.dashboards && item.dashboards.length > 0) {
            return (
              <SidebarCollapse
                key={index}
                icon={Icon}
                label={item.title}
                paths={item.dashboards.map((d: any) => d.dashboard)}
              >
                {item.dashboards.map((nestedItem: any, nestedIndex: number) => (
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
  const { sidebarConfig } = useSidebarConfig();

  return <>{renderSidebarMenu(sidebarConfig)}</>;
};

export default SystemSidebar;
