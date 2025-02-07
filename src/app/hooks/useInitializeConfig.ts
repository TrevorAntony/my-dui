import { useEffect, useState } from "react";
import { UnauthorizedError } from "../../core/api/DuftHttpClient/ErrorClasses";
import { client } from "../../core/api/DuftHttpClient/local-storage-functions";
import type { Config } from "../../core/context/types";
import { DuftHttpClient } from "../../core/api/DuftHttpClient/DuftHttpClient";

export const useInitializeConfig = (customHttpClient?: DuftHttpClient) => {
  const [config, setConfig] = useState<Config | null>(null);
  const httpClient = customHttpClient || client;

  useEffect(() => {
    const initConfig = async () => {
      try {
        const configData = await httpClient.getCurrentConfig();
        setConfig(configData);
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          const configData = await httpClient.getCurrentConfig(false);
          setConfig(configData);
        }
      }
    };
    initConfig();
  }, [httpClient]);

  return config;
};
