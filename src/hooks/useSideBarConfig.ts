import { useState, useEffect } from "react";
import { defaultSidebarConfig } from "../helpers/constants";
import type { NavigationConfig } from "../components/types";
import { DuftHttpClient } from "../api/DuftHttpClient/DuftHttpClient";
import config from "../config";

const client = new DuftHttpClient(config.apiBaseUrl);

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
