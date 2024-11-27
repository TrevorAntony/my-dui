import { useState, useEffect } from "react";
import config from "../config";

export const useVersion = () => {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/get-current-config`);
        const data = await response.json();
        setVersion(data.version);
      } catch (error) {
        console.error("Error fetching version:", error);
      }
    };

    fetchVersion();
  }, []);

  return version;
};
