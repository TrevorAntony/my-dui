import React from "react";
import { NavLink } from "react-router-dom";
import { Sidebar } from "flowbite-react";

type SidebarNavLinkProps = {
  to: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
};

export const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  to,
  icon: Icon,
  children,
  onClick,
  className,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `${isActive && to !== "#" ? "active-link" : ""} ${className || ""}`
      }
      onClick={onClick}
    >
      {({ isActive }) => (
        <Sidebar.Item
          as="div"
          icon={Icon}
          className={isActive && to !== "#" ? "bg-highlight-100 dark:bg-highlight-900" : ""}
        >
          {children}
        </Sidebar.Item>
      )}
    </NavLink>
  );
};
