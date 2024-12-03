import type { FC } from "react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { HiMenuAlt1, HiX } from "react-icons/hi";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import config from "../config";
import { useSidebarConfigContext } from "../3dl/context/SidebarConfigContext";
import { useAppState } from "../context/AppStateContext";
import { setTokenInLocalStorage } from "../api/DuftHttpClient/local-storage-functions";
import { userDropdownTheme } from "../flowbite-theme";

const ExampleNavbar: FC = function () {
  const { state } = useAppState();
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();
  const sidebarConfig = useSidebarConfigContext();

  const handleLogout = () => {
    setTokenInLocalStorage(null, null);
  };

  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPageWithSidebar && (
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnSmallScreens && isSmallScreen() ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </button>
            )}
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/public/images/duft.png"
                className="mr-3 h-6 sm:h-8"
              />
              <span className="text-highlight-800 dark:text-highlight-200 self-center whitespace-nowrap text-2xl font-semibold">
                {sidebarConfig.system.settings?.appName || config.title}
              </span>
            </Navbar.Brand>
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <Dropdown
                arrowIcon={false}
                inline
                theme={userDropdownTheme}
                label={
                  <div className="flex items-center gap-2">
                    <Avatar
                      alt="User"
                      img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      rounded
                      size="sm"
                    />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {state?.config?.currentUser?.username}
                      </div>
                    </div>
                  </div>
                }
              >
                <Dropdown.Divider />
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
