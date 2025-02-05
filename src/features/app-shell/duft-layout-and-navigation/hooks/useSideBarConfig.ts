import { useState, useEffect } from "react";
import { defaultSidebarConfig } from "../../../../utils/constants";
import type { NavigationConfig } from "../types";
import { client } from "../api/DuftHttpClient/local-storage-functions";

export const useSidebarConfig = () => {
  const [sidebarConfig, setSidebarConfig] = useState(defaultSidebarConfig);

  useEffect(() => {
    const loadSidebarConfig = async () => {
      try {
        const config = await client.getNavigationFile();
        setSidebarConfig((config as NavigationConfig) || defaultSidebarConfig);
      } catch (err) {
        console.error("Failed to load sidebar config", err);
        setSidebarConfig(defaultSidebarConfig);
      }
    };

    loadSidebarConfig();
  }, []);

  return { sidebarConfig };
};
