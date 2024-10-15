import { useState, useEffect } from "react";
import { fetchDataWithoutStore } from "../api/api";
import { defaultSidebarConfig } from "../helpers/constants";

export const useSidebarConfig = () => {
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
