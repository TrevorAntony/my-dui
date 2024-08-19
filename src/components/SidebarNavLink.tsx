import React from "react";
import { NavLink } from "react-router-dom";
import { Sidebar } from "flowbite-react";

type SidebarNavLinkProps = {
  to: string;
  icon?: React.ComponentType<any>; // Optional icon prop
  children: React.ReactNode;
};

export const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  to,
  icon: Icon,
  children,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "active-link" : "")}
    >
      {({ isActive }) => (
        <Sidebar.Item
          as="div"
          icon={Icon}
          className={isActive ? "bg-gray-100 dark:bg-gray-700" : ""}
        >
          {children}
        </Sidebar.Item>
      )}
    </NavLink>
  );
};
