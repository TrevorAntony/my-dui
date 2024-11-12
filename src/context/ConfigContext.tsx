import type { ReactNode } from "react";
import { createContext, useState, useEffect, useContext } from "react";
import config from "../config";

// Set the initial value as `false`
const ConfigContext = createContext<boolean>(false);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [authenticationEnabled, setAuthenticationEnabled] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/get-current-config`);

        if (!response.ok) {
          throw new Error("Failed to fetch config");
        }

        const data = await response.json();

        const userAuthenticationFeature = data.features.find(
          (feature: { [key: string]: boolean }) =>
            // eslint-disable-next-line no-prototype-builtins
            feature.hasOwnProperty("user_authentication"),
        )?.user_authentication;

        setAuthenticationEnabled(!!userAuthenticationFeature);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={authenticationEnabled}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useDuftConfigurations = () => {
  const context = useContext(ConfigContext);
  return context;
};
