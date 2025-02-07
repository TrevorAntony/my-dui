import { FC } from "react";
import { MdOutlineSettings } from "react-icons/md";
import { SidebarNavLink } from "./helpers/sidebar-nav-link";
import { Sidebar } from "flowbite-react";

interface SettingsAndAboutNavItemsProps {
  setIsSettingsOpen: (isOpen: boolean) => void;
  setIsAboutOpen: (isOpen: boolean) => void;
}

export const SettingsAndAboutNavItems: FC<SettingsAndAboutNavItemsProps> = ({
  setIsSettingsOpen,
  setIsAboutOpen,
}) => {
  return (
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
  );
};
