/* eslint-disable jsx-a11y/anchor-is-valid */
import config from "../config";
import classNames from "classnames";
import { Dropdown, Sidebar, TextInput, Tooltip } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiAdjustments,
  HiChartPie,
  HiClipboard,
  HiCog,
  HiFolder,
  HiHashtag,
  HiOutlineFolder,
  HiSearch,
} from "react-icons/hi";

import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";

import { SidebarNavLink } from "./SidebarNavLink";
import SidebarCollapse from "./sidebar-collapse";
import SidebarGroup from "./sidebar-group";
import SystemSidebar from "./api-navigation-sidebar";

const ExampleSidebar: FC = function () {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  console.log("currentPage", currentPage);
  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      <div className="relative bg-green-100">
        <Sidebar
          aria-label="Sidebar with multi-level dropdown example"
          collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}
          className="bg-white"
        >
          <div className="flex h-full flex-col justify-between py-2">
            <div className="FLUP 2">
              <form className="pb-3 md:hidden">
                <TextInput
                  icon={HiSearch}
                  type="search"
                  placeholder="Search"
                  required
                  size={32}
                />
              </form>

              <Sidebar.Items>
                <SystemSidebar />
                {config.debugMode === "true" ? (
                  <>
                    <SidebarGroup title="Test 3DL Components">
                      <SidebarCollapse
                        icon={HiOutlineFolder}
                        label="3DL Sample"
                        paths={["/dashboard/raw/3dlsample"]}
                      >
                        <SidebarNavLink
                          to={"/dashboard/raw/3dlsample"}
                          icon={HiChartPie}
                        >
                          Sample 1
                        </SidebarNavLink>
                        <SidebarNavLink
                          to={"/dashboard/raw/3dlsample-2"}
                          icon={HiChartPie}
                        >
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
                        className={
                          "/s" === currentPage
                            ? "bg-gray-100 dark:bg-gray-700"
                            : ""
                        }
                      >
                        S
                      </Sidebar.Item>
                    </SidebarGroup>
                    <SidebarGroup title="Data tasks">
                      <Sidebar.Item icon={HiClipboard}>Data Tasks</Sidebar.Item>
                    </SidebarGroup>
                  </>
                ) : (
                  <></>
                )}
              </Sidebar.Items>
            </div>
            <BottomMenu />
          </div>
        </Sidebar>
      </div>
    </div>
  );
};

const BottomMenu: FC = function () {
  return (
    <div className="flex items-center justify-center gap-x-5">
      <div>
        <Tooltip content="Data task indicator">
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          ></div>
        </Tooltip>
      </div>
    </div>
  );
};

export default ExampleSidebar;
