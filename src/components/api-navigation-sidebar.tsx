import React, { useEffect, useState } from "react";
import { HiHome, HiChartPie, HiHashtag } from "react-icons/hi";
import SidebarCollapse from "./sidebar-collapse";
import SidebarGroup from "./sidebar-group";
import { SidebarNavLink } from "./ui-wrappers";
import { fetchDataWithoutStore } from "../api/api"; // Importing the API function

// Mapping of icon names to actual React components
const iconMap: { [key: string]: React.ElementType } = {
  "home-icon": HiHome,
  "dashboard-icon": HiChartPie,
  "dashboards-icon": HiChartPie,
  "hashtag-icon": HiHashtag,
  // Add more mappings as needed
};

// Default configuration with only one Home item as a placeholder
const defaultSidebarConfig = {
  system: {
    menu: [
      {
        title: "Home",
        icon: "home-icon",
        dashboard: "/",
      },
    ],
  },
  user: {
    menu: [],
  },
};

const renderSidebarMenu = (config: any) => {
  const systemMenu = config.system?.menu || [];
  const userMenu = config.user?.menu || [];

  // Extract the Home item from the System menu
  const homeItem = systemMenu.find((item: any) => item.title === "Home");

  const homeGroup = homeItem ? (
    <SidebarGroup key="home-group">
      <SidebarNavLink to={homeItem.dashboard} icon={iconMap[homeItem.icon]}>
        {homeItem.title}
      </SidebarNavLink>
    </SidebarGroup>
  ) : null;

  // Filter out Home from the System menu and create a System group if there are other items
  const systemDashboards = systemMenu.filter(
    (item: any) => item.title !== "Home"
  );

  const systemGroup =
    systemDashboards.length > 0 ? (
      <SidebarGroup key="system-group" title="System">
        {systemDashboards.map((item: any, index: number) => {
          if (item.dashboards && item.dashboards.length > 0) {
            return (
              <SidebarCollapse
                key={index}
                icon={iconMap[item.icon]}
                label={item.title}
                paths={item.dashboards.map((d: any) => d.dashboard)}
              >
                {item.dashboards.map((nestedItem: any, nestedIndex: number) => (
                  <SidebarNavLink
                    key={nestedIndex}
                    to={nestedItem.dashboard}
                    icon={iconMap[nestedItem.icon]}
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
                to={item.dashboard}
                icon={iconMap[item.icon]}
              >
                {item.title}
              </SidebarNavLink>
            );
          }
        })}
      </SidebarGroup>
    ) : null;

  // Filter out Home (if any) from the User menu and create a User group if there are dashboards
  const userDashboards = userMenu.filter((item: any) => item.title !== "Home");

  const userGroup =
    userDashboards.length > 0 ? (
      <SidebarGroup key="user-group" title="User">
        {userDashboards.map((item: any, index: number) => {
          if (item.dashboards && item.dashboards.length > 0) {
            return (
              <SidebarCollapse
                key={index}
                icon={iconMap[item.icon]}
                label={item.title}
                paths={item.dashboards.map((d: any) => d.dashboard)}
              >
                {item.dashboards.map((nestedItem: any, nestedIndex: number) => (
                  <SidebarNavLink
                    key={nestedIndex}
                    to={nestedItem.dashboard}
                    icon={iconMap[nestedItem.icon]}
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
                to={item.dashboard}
                icon={iconMap[item.icon]}
              >
                {item.title}
              </SidebarNavLink>
            );
          }
        })}
      </SidebarGroup>
    ) : null;

  return (
    <>
      {homeGroup}
      {systemGroup}
      {userGroup}
    </>
  );
};

const SystemSidebar = () => {
  const [sidebarConfig, setSidebarConfig] = useState(defaultSidebarConfig);

  useEffect(() => {
    const loadSidebarConfig = async () => {
      try {
        const config = await fetchDataWithoutStore("/navigation");
        // Ensure config has the expected structure
        const hasSystemDashboards = config.system?.menu?.some(
          (item: any) => item.title !== "Home"
        );
        setSidebarConfig(hasSystemDashboards ? config : defaultSidebarConfig);
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

/* 
Example JSX structure generated by this code based on sampleSidebarConfig:

<SidebarGroup>
  <SidebarNavLink to="/" icon={HiHome}>
    Home
  </SidebarNavLink>
</SidebarGroup>

<SidebarGroup title="System">
  <SidebarNavLink to="/dashboard" icon={HiChartPie}>
    Dashboard 1
  </SidebarNavLink>
  <SidebarCollapse icon={HiChartPie} label="Dashboards Collapse" paths={["/a", "/b", "/c", "/d", "/api"]}>
    <SidebarNavLink to="/a" icon={HiChartPie}>
      Sub Dashboard 1
    </SidebarNavLink>
    <SidebarNavLink to="/b" icon={HiChartPie}>
      Sub Dashboard 2
    </SidebarNavLink>
    <SidebarNavLink to="/c" icon={HiChartPie}>
      Sub Dashboard 3
    </SidebarNavLink>
    <SidebarNavLink to="/d" icon={HiChartPie}>
      Sub Dashboard 4
    </SidebarNavLink>
    <SidebarNavLink to="/api" icon={HiHashtag}>
      APIs
    </SidebarNavLink>
  </SidebarCollapse>
</SidebarGroup>

<SidebarGroup title="User">
  <SidebarNavLink to="/dashboard" icon={HiChartPie}>
    User Dashboard 1
  </SidebarNavLink>
  <SidebarCollapse icon={HiChartPie} label="My Dashboards" paths={["/a", "/b", "/c", "/d", "/api"]}>
    <SidebarNavLink to="/a" icon={HiChartPie}>
      Sub UserDashboard 1
    </SidebarNavLink>
    <SidebarNavLink to="/b" icon={HiChartPie}>
      Sub UserDashboard 2
    </SidebarNavLink>
    <SidebarNavLink to="/c" icon={HiChartPie}>
      Sub UserDashboard 3
    </SidebarNavLink>
    <SidebarNavLink to="/d" icon={HiChartPie}>
      Sub UserDashboard 4
    </SidebarNavLink>
    <SidebarNavLink to="/api" icon={HiHashtag}>
      APIs
    </SidebarNavLink>
  </SidebarCollapse>
</SidebarGroup>

*/
