import { useState, useEffect } from "react";
import { fetchDataWithoutStore } from "../api/api";
import { defaultSidebarConfig } from "../helpers/constants";
import type { SidebarConfig } from "../types/side-bar-config";

export const useSidebarConfig = () => {
  const [sidebarConfig, setSidebarConfig] = useState(defaultSidebarConfig);

  useEffect(() => {
    const loadSidebarConfig = async () => {
      try {
        const config = await fetchDataWithoutStore("/navigation");
        setSidebarConfig((config as SidebarConfig) || defaultSidebarConfig);
      } catch (err) {
        console.error("Failed to load sidebar config", err);
        setSidebarConfig(defaultSidebarConfig);
      }
    };

    loadSidebarConfig();
  }, []);

  return { sidebarConfig };
};
