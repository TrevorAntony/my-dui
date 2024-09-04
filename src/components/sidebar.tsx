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
    is_running?: boolean;
    output?: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:8000/sse/dte/");

    eventSource.onmessage = (event) => {
      let stringData = event.data;

      stringData = stringData
        .replace(/'/g, '"')
        .replace(/None/g, "null")
        .replace(/False/g, "false")
        .replace(/True/g, "true");

      const parsedData = JSON.parse(stringData);

      setData(parsedData);

      // Open modal if `is_running` is true
      if (parsedData.is_running) {
        setIsModalOpen(true);
        // setModalContent((prevContent) => [
        //   ...prevContent,
        //   `Event #${prevContent.length + 1}: ${JSON.stringify(parsedData)}`,
        // ]);

        channel.postMessage({
          type: "TOGGLE_MODAL",
          isModalOpen: true,
        });
      }

      // Handle output property
      if (parsedData.output !== null && parsedData.output !== undefined) {
        setModalContent((prevContent) => [
          ...prevContent,
          `${parsedData.output}`,
        ]);
      }

      // Display 'data task completed' message when `is_running` turns to false
      if (parsedData.is_running === false) {
        setModalContent((prevContent) => {
          if (
            !prevContent.includes("Data task completed") &&
            prevContent.length
          ) {
            return [...prevContent, "Data task completed"];
          }
          return prevContent;
        });
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
    backgroundColor: data && data.is_running ? "green" : "red",
    cursor: "pointer",
  };

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
          {data?.output?.includes("Script completed") ||
            (!data?.is_running && (
              <Modal.Footer>
                <Button color="primary" onClick={handleButtonClose}>
                  Close
                </Button>
              </Modal.Footer>
            ))}
        </Modal>
      )}
    </>
  );
};

export default ExampleSidebar;
