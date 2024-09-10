/* eslint-disable jsx-a11y/anchor-is-valid */
import config from "../config";
import classNames from "classnames";
import { Modal, Button, Sidebar, TextInput, Tooltip } from "flowbite-react";
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
// import useFetchDteStatus from "../3dlcomponents/resources/useFetchDteStatus";

const ExampleSidebar: FC = function () {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

  const [currentPage, setCurrentPage] = useState("");

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
      const parsedData = JSON.parse(event.data); // Assuming the data is in JSON format

      setData(parsedData);

      console.log("parsedData: ", parsedData);
      // Open modal when isRunning is true
      if (parsedData.isRunning) {
        console.log("parsedData.isRunning:", parsedData.isRunning);
        setIsModalOpen(true);

        // Post a message to other channels if needed
        channel.postMessage({
          type: "TOGGLE_MODAL",
          isModalOpen: true,
        });
      }

      // Handle output property (append to modal content)
      if (parsedData.message) {
        setModalContent((prevContent) => [...prevContent, parsedData.message]);
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
    // Listen for messages from the postMessage channel
    channel.onmessage = (event) => {
      if (event.data.type === "TOGGLE_MODAL") {
        setIsModalOpen(event.data.isModalOpen);
        if (!event.data.isModalOpen) {
          setModalContent([]); // Clear content when modal is closed
        }
      }
    };
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent([]); // Clear content when modal is closed
    channel.postMessage({ type: "TOGGLE_MODAL", isModalOpen: false });
  };

  const handleButtonClose = () => {
    setIsModalOpen(false);
    setModalContent([]); // Clear content when modal is closed
    channel.postMessage({ type: "TOGGLE_MODAL", isModalOpen: false });

    // Reload the page and navigate to the root path
    window.location.href = "/dashboard/home";
  };

  const divStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: data?.isRunning ? "green" : "red",
    cursor: "pointer",
  };

  // console.log({ isModalOpen });

  return (
    <>
      <div className="flex items-center justify-center gap-x-5">
        <Tooltip content="Data task indicator">
          <div style={divStyle}></div>
        </Tooltip>
      </div>

      {isModalOpen && (
        <Modal show={isModalOpen} onClose={handleCloseModal} size="2xl">
          <div className="p-4 text-lg font-semibold">Running data task</div>
          <Modal.Body className="max-h-[700px] overflow-y-auto">
            <ul className="space-y-4">
              {modalContent.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Modal.Body>
          {data?.message?.includes("Script completed") || !data?.isRunning ? (
            <Modal.Footer>
              <Button color="primary" onClick={handleButtonClose}>
                Close
              </Button>
            </Modal.Footer>
          ) : null}
        </Modal>
      )}
    </>
  );
};

export default ExampleSidebar;
