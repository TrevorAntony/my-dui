import React, { FC, PropsWithChildren } from "react";
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

const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  isFooter,
}) {
  const { isOpenOnSmallScreens: isSidebarOpen } = useSidebarContext();

  return (
    <main
      className={classNames(
        "overflow-y-auto relative w-full h-full bg-gray-50 dark:bg-gray-900 p-0",
        isSidebarOpen ? "lg:ml-16" : "lg:ml-64"
      )}
    >
      <div className="px-4 pt-6">
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
    <>
      <Footer container>
        <div className="flex w-full flex-col gap-y-6 lg:flex-row lg:justify-between lg:gap-y-0">
          <Footer.LinkGroup>
            <Footer.Link href="#" className="mr-3 mb-3 lg:mb-0">
              Terms and conditions
            </Footer.Link>
            <Footer.Link href="#" className="mr-3 mb-3 lg:mb-0">
              Privacy Policy
            </Footer.Link>
            <Footer.Link href="#" className="mr-3">
              Licensing
            </Footer.Link>
            <Footer.Link href="#" className="mr-3">
              Cookie Policy
            </Footer.Link>
            <Footer.Link href="#">Contact</Footer.Link>
          </Footer.LinkGroup>
          <Footer.LinkGroup>
            <div className="flex gap-4 md:gap-0">
              <Footer.Link
                href="#"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <MdFacebook className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="#"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaInstagram className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="#"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaTwitter className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="#"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaGithub className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="#"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaDribbble className="text-lg" />
              </Footer.Link>
            </div>
          </Footer.LinkGroup>
        </div>
      </Footer>
      <p className="my-8 text-center text-sm text-gray-500 dark:text-gray-300">
        &copy; 2019-2022 Flowbite.com. All rights reserved.
      </p>
    </>
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
