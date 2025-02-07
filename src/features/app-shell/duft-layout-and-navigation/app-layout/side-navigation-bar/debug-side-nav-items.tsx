import { FC } from "react";
import {
  HiOutlineFolder,
  HiChartPie,
  HiHashtag,
  HiClipboard,
} from "react-icons/hi";
import { Sidebar } from "flowbite-react";
import SidebarGroup from "./helpers/sidebar-group";
import SidebarCollapse from "./helpers/sidebar-collapse";
import { SidebarNavLink } from "./helpers/sidebar-nav-link";

interface DebugSideNavItemsProps {
  currentPage: string;
}

export const DebugSideNavItems: FC<DebugSideNavItemsProps> = ({
  currentPage,
}) => {
  return (
    <>
      <SidebarGroup title="Test 3DL Components">
        <SidebarCollapse
          icon={HiOutlineFolder}
          label="3DL Sample"
          paths={["/dashboard/raw/3dlsample"]}
        >
          <SidebarNavLink to={"/dashboard/raw/3dlsample"} icon={HiChartPie}>
            Sample 1
          </SidebarNavLink>
          <SidebarNavLink to={"/dashboard/raw/3dlsample-2"} icon={HiChartPie}>
            Sample 2
          </SidebarNavLink>
        </SidebarCollapse>

        <SidebarNavLink to={"/grid"} icon={HiChartPie}>
          Grid Layout
        </SidebarNavLink>
        <SidebarNavLink to={"/tab"} icon={HiChartPie}>
          Tab Layout
        </SidebarNavLink>
        <SidebarNavLink to={"/table"} icon={HiChartPie}>
          Table Layout
        </SidebarNavLink>
        <SidebarNavLink to={"/a"} icon={HiChartPie}>
          AAA + AAA
        </SidebarNavLink>
        <SidebarNavLink to={"/b"} icon={HiChartPie}>
          BBB + BBB
        </SidebarNavLink>
        <SidebarNavLink to={"/c"} icon={HiChartPie}>
          CCC + CCC
        </SidebarNavLink>
        <SidebarNavLink to={"/D"} icon={HiChartPie}>
          DDD + DDD
        </SidebarNavLink>

        <SidebarCollapse
          icon={HiHashtag}
          label="APIs"
          paths={["/api", "/api/dashboard", "/api/settings"]}
        >
          <SidebarNavLink to={"/api"} icon={HiChartPie}>
            API
          </SidebarNavLink>
        </SidebarCollapse>

        <Sidebar.Item
          href="/s"
          icon={HiChartPie}
          className={"/s" === currentPage ? "bg-gray-100 dark:bg-gray-700" : ""}
        >
          S
        </Sidebar.Item>
      </SidebarGroup>
      <SidebarGroup title="Data tasks">
        <Sidebar.Item icon={HiClipboard}>Data Tasks</Sidebar.Item>
      </SidebarGroup>
    </>
  );
};
