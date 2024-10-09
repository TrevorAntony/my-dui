import { useState, useEffect } from "react";
import { SidebarConfig } from "../types/side-bar-config";
import { fetchDataWithoutStore } from "../api/api";

export const useSidebarConfig = () => {
  const defaultSidebarConfig: SidebarConfig = {
    system: {
      home: {
        title: "Home",
        icon: "home-icon",
        dashboard: "/",
      },
      menu: [],
      dataTasks: [],
    },
    user: {
      menu: [],
    },
  };

  const [sidebarConfig, setSidebarConfig] = useState(defaultSidebarConfig);

  useEffect(() => {
    const loadSidebarConfig = async () => {
      try {
        const config = await fetchDataWithoutStore("/navigation");
        setSidebarConfig(config || defaultSidebarConfig);
      } catch (err) {
        console.error("Failed to load sidebar config", err);
        setSidebarConfig(defaultSidebarConfig);
      }
    };

    loadSidebarConfig();
  }, []);

  return { sidebarConfig };
};
