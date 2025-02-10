/* eslint-disable jsx-a11y/anchor-is-valid */
import config from "../../../../../config";
import classNames from "classnames";
import { Button, Modal, Sidebar } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
// import {
//   HiChartPie,
//   HiClipboard,
//   HiHashtag,
//   HiOutlineFolder,
// } from "react-icons/hi";
// import { MdOutlineSettings } from "react-icons/md";

import isSmallScreen from "../../../../../utils/is-small-screen";
// import { SidebarNavLink } from "../../sidebar-nav-link";
// import SidebarCollapse from "../../sidebar-collapse";
// import SidebarGroup from "../../sidebar-group";
import SettingsDisplay from "../../../duft-settings/duft-settings-components/settings-display";
import AboutDlg from "../../../duft-about/duft-about";
import { useSidebarContext } from "../../../../../core/context/SidebarContext";
import DataTaskIndicatorAndLauncher from "./data-tasks/data-task-indicator-and-launcher";
import { SettingsAndAboutNavItems } from "./settings-and-about-nav-items";
import { DebugSideNavItems } from "./debug-side-nav-items";
import NavigationConfigSideNavItems from "./navigation-config-side-nav-items";

const SideNavigationBar: FC = function () {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

  const [currentPage, setCurrentPage] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    const newPage = window.location.pathname;

    setCurrentPage(newPage);
  }, [setCurrentPage]);

  return (
    <div
      className={classNames("lg:!block", {
        hidden: !isSidebarOpenOnSmallScreens,
      })}
    >
      {/* Side navigation items */}
      <div className="relative bg-green-100">
        <Sidebar
          aria-label="Sidebar with multi-level dropdown example"
          collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}
          className="bg-white"
        >
          <div className="flex h-full flex-col justify-between py-2">
            <div className="flex flex-col">
              <Sidebar.Items>
                {/* These come from the navigation config */}
                <NavigationConfigSideNavItems />
                <SettingsAndAboutNavItems
                  setIsSettingsOpen={setIsSettingsOpen}
                  setIsAboutOpen={setIsAboutOpen}
                />
                {config.debugMode === "true" ? (
                  <DebugSideNavItems currentPage={currentPage} />
                ) : null}
              </Sidebar.Items>
            </div>
            <DataTaskIndicatorAndLauncher />
          </div>
        </Sidebar>
      </div>

      {/* Settings modal */}
      <Modal
        show={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
        }}
        position="center"
        size="7xl"
      >
        <Modal.Header>Settings</Modal.Header>
        <Modal.Body className="flex flex-col overflow-hidden ">
          <div className="flex h-[400px] flex-col overflow-hidden">
            <SettingsDisplay />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              onClick={() => {
                setIsSettingsOpen(false);
              }}
              color="primary"
            >
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* About dialog box    */}
      <AboutDlg
        isOpen={isAboutOpen}
        onClose={() => {
          setIsAboutOpen(false);
        }}
      />
    </div>
  );
};

export default SideNavigationBar;
