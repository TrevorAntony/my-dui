import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";

type SidebarCollapseProps = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  children: React.ReactNode;
  paths: string[];
};

const SidebarCollapse: React.FC<SidebarCollapseProps> = ({
  icon: Icon,
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
      setIsCollapseOpen(true);
    }
  }, [shouldBeOpen]);

  return (
    <Sidebar.Collapse
      icon={Icon}
      label={label}
      open={isCollapseOpen}
      onClick={() => setIsCollapseOpen(!isCollapseOpen)}
    >
      {children}
    </Sidebar.Collapse>
  );
};

export default SidebarCollapse;
