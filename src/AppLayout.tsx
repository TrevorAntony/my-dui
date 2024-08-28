import type { FC, PropsWithChildren } from "react";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { SidebarProvider, useSidebarContext } from "./context/SidebarContext";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import classNames from "classnames";
import { Footer } from "flowbite-react";
import { FaInstagram, FaTwitter, FaGithub, FaDribbble } from "react-icons/fa";
import { MdFacebook } from "react-icons/md";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <Navbar />
      <div className="flex items-start pt-16">
        <Sidebar />
        <MainContent isFooter={true} />
      </div>
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
        "flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 p-0",
        isSidebarOpen ? "lg:ml-16" : "lg:ml-64"
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
  return (
    <p className="my-8 text-center text-sm text-gray-500 dark:text-gray-300">
      &copy; 2024 UCSF-IGHS. All rights reserved.
    </p>
  );
};

const AppLayout2: React.FC = () => {
  return (
    <div className="layout">
      <header>Navbar</header> {/* The navigation bar */}
      <div className="main-content">
        <aside>
          <ul>
            <li>
              <NavLink
                to="/a"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Link A
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/b"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Link B
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/c"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                Link C
              </NavLink>
            </li>
          </ul>
        </aside>
        <main>
          <h1 className="text-3xl font-bold underline">Hello world!</h1>
          <Outlet /> {/* Routed content will be injected here */}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
