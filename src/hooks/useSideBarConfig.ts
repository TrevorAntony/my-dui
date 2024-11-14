import { useState, useEffect } from "react";
import { fetchDataWithoutStore } from "../api/api";
import { defaultSidebarConfig } from "../helpers/constants";
import type { NavigationConfig } from "../components/types";
import { useDuftConfigurations } from "../context/ConfigContext";

export const useSidebarConfig = () => {
  const [sidebarConfig, setSidebarConfig] = useState(defaultSidebarConfig);
  const authenticationEnabled = useDuftConfigurations();

  useEffect(() => {
    const loadSidebarConfig = async () => {
      try {
        const config = await fetchDataWithoutStore(
          "/navigation",
          authenticationEnabled
        );
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
