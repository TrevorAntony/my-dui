import React from "react";
import TopNavigationBar from "./top-navigation-bar/top-navigation-bar";
import SideNavigationBar from "./side-navigation-bar/side-navigation-bar";
import { SidebarConfigProvider } from "../../../../core/context/SidebarConfigContext";
import { SidebarProvider } from "../../../../core/context/SidebarContext";
import MainContent from "./main-content/main-content";

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <SidebarConfigProvider>
        <TopNavigationBar />
        <div className="flex items-start pt-16">
          <SideNavigationBar />
          <MainContent isFooter={true} />
        </div>
      </SidebarConfigProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
