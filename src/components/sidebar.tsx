/* eslint-disable jsx-a11y/anchor-is-valid */
import config from "../config";
import classNames from "classnames";
import { Button, Modal, Sidebar } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiClipboard,
  HiHashtag,
  HiOutlineFolder,
} from "react-icons/hi";
import { MdOutlineSettings } from "react-icons/md";

import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import { SidebarNavLink } from "./sidebar-nav-link";
import SidebarCollapse from "./sidebar-collapse";
import SidebarGroup from "./sidebar-group";
import SystemSidebar from "./navigation-sidebar";
import { renderModalContent } from "../helpers/modalContentHelper";
import SettingsDisplay from "../ui-components/duft-settings/duft-settings-components/settings-display";
import AboutDlg from "../ui-components/duft-about/duft-about";
import DataTaskDialog from "./data-task-dialog";

const ExampleSidebar: FC = function () {
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
      <div className="relative bg-green-100">
        <Sidebar
          aria-label="Sidebar with multi-level dropdown example"
          collapsed={isSidebarOpenOnSmallScreens && !isSmallScreen()}
          className="bg-white"
        >
          <div className="flex h-full flex-col justify-between py-2">
            <div className="flex flex-col">
              <Sidebar.Items>
                <SystemSidebar />
                <Sidebar.ItemGroup key="home-group">
                  <SidebarNavLink
                    to="#"
                    icon={MdOutlineSettings}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsSettingsOpen(true);
                    }}
                  >
                    Settings
                  </SidebarNavLink>
                  <SidebarNavLink
                    to="#"
                    icon={MdOutlineSettings}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAboutOpen(true);
                      console.log("Set About True");
                    }}
                  >
                    About DUFT
                  </SidebarNavLink>
                </Sidebar.ItemGroup>
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

      <AboutDlg
        isOpen={isAboutOpen}
        onClose={() => {
          setIsAboutOpen(false);
        }}
      />
    </div>
  );
};

const channel = new BroadcastChannel("bottom-menu-channel");

const BottomMenu: FC = function () {
  const [data, setData] = useState<{
    isRunning?: boolean;
    message?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:8000/sse/dte/");

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      setData(parsedData);

      if (parsedData.isRunning) {
        setIsModalOpen(true);

        channel.postMessage({
          type: "TOGGLE_MODAL",
          isModalOpen: true,
        });
      }

      const { message, dataTask } = parsedData;

      const maxLength = 150;

      const isValidMessage =
        dataTask &&
        dataTask !== "script_start" &&
        dataTask !== "script_complete" &&
        dataTask !== "scriptError" &&
        message?.length <= maxLength;

      if (isValidMessage) {
        setModalContent((prevContent) => [...prevContent, message]);
      }
    };

    eventSource.onerror = () => {
      console.error("Error with SSE connection");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    channel.onmessage = (event) => {
      if (event.data.type === "TOGGLE_MODAL") {
        setIsModalOpen(event.data.isModalOpen);
        if (!event.data.isModalOpen) {
          setModalContent([]);
        }
      }
    };
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent([]);
    channel.postMessage({ type: "TOGGLE_MODAL", isModalOpen: false });
    window.location.reload();
  };

  const divStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: data?.isRunning ? "green" : "red",
    cursor: "pointer",
  };

  const content = renderModalContent(modalContent);
  return (
    <>
      <div className="flex items-center justify-center gap-x-5">
        <div style={divStyle}></div>
      </div>

      <DataTaskDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Data Refresh"
        executeButtonText="Run data task"
        disableButtons={data?.isRunning}
      >
        <div className="h-[180px] overflow-y-auto pb-8">{content}</div>
      </DataTaskDialog>
    </>
  );
};

export default ExampleSidebar;
