import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react"; // Adjust according to your imports
import { HiShoppingBag, HiChartPie } from "react-icons/hi";
import SidebarNavLink from "./ui-wrappers"; // Adjust the import according to your project structure

type SidebarCollapseProps = {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  paths: string[]; // Paths that should trigger the collapse to be open
};

const SidebarCollapse: React.FC<SidebarCollapseProps> = ({
  icon,
  label,
  children,
  paths,
}) => {
  const location = useLocation();
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  // Check if the current path matches any of the paths provided
  const shouldBeOpen = paths.includes(location.pathname);

  useEffect(() => {
    if (shouldBeOpen) {
      setIsCollapseOpen(true); // Open if the path matches
    }
  }, [shouldBeOpen]);

  return (
    <Sidebar.Collapse
      icon={icon}
      label={label}
      open={isCollapseOpen}
      onClick={() => setIsCollapseOpen(!isCollapseOpen)} // Toggle open state
    >
      {children}
    </Sidebar.Collapse>
  );
};

export default SidebarCollapse;
