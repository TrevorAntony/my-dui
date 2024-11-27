import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebarContext } from "./context/SidebarContext";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import classNames from "classnames";
import { SidebarConfigProvider } from "./3dl/context/SidebarConfigContext";
import { useAppState } from "./context/AppStateContext";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <SidebarConfigProvider>
        <Navbar />
        <div className="flex items-start pt-16">
          <Sidebar />
          <MainContent isFooter={true} />
        </div>
      </SidebarConfigProvider>
    </SidebarProvider>
  );
};

// Removed xl:grid-cols-2
const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  isFooter,
}) {
  const { isOpenOnSmallScreens: isSidebarOpen } = useSidebarContext();

  return (
    <main
      className={classNames(
        "flex flex-col min-h-[calc(100vh-50px)] bg-gray-50 dark:bg-gray-900 p-0",
        isSidebarOpen ? "lg:ml-16" : "lg:ml-64",
      )}
    >
      <div className="grow overflow-y-auto">
        <Outlet />
      </div>
      {isFooter && (
        <div className="mx-4 mt-4">
          <MainContentFooter />
        </div>
      )}
    </main>
  );
};

const MainContentFooter: FC = function () {
  const { state } = useAppState();

  return (
    <p className="my-8 text-center text-sm text-gray-500 dark:text-gray-300">
      © {new Date().getFullYear()} DUFT Version {state.config?.version}. All
      Rights Reserved.
    </p>
  );
};

export default AppLayout;
