import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";
import { useSidebarConfig } from "../../hooks/useSideBarConfig";
import type { NavigationConfig } from "../../components/types";

const SidebarConfigContext = createContext<NavigationConfig>(undefined);

export const SidebarConfigProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { sidebarConfig } = useSidebarConfig();

  return (
    <SidebarConfigContext.Provider value={sidebarConfig}>
      {children}
    </SidebarConfigContext.Provider>
  );
};

export const useSidebarConfigContext = () => {
  const context = useContext(SidebarConfigContext);
  if (context === undefined) {
    throw new Error(
      "useSidebarConfigContext must be used within a SidebarConfigProvider",
    );
  }
  return context;
};
