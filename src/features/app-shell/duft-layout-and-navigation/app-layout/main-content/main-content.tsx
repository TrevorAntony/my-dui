import type { FC, PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import classNames from "classnames";
import { useAppState } from "../../../../../core/context/AppStateContext";
import { useSidebarContext } from "../../../../../core/context/SidebarContext";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

// Removed xl:grid-cols-2
const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  isFooter,
}) {
  const { isOpenOnSmallScreens: isSidebarOpen } = useSidebarContext();

  return (
    <main
      className={classNames(
        "flex flex-col min-h-[calc(100vh-50px)] bg-gray-50 dark:bg-gray-900 p-0",
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
  const { state } = useAppState();

  return (
    <p className="my-8 text-center text-sm text-gray-500 dark:text-gray-300">
      © {new Date().getFullYear()} DUFT Version {state.config?.version}. All
      Rights Reserved.
    </p>
  );
};

export default MainContent;
