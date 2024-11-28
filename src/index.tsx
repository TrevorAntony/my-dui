import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppStateProvider } from "./context/AppStateContext";
import AppInitializer from "./ui-components/app-initializer";

import { Flowbite } from "flowbite-react";
import theme from "./flowbite-theme";

import "./index.css";
import "./input.css";
import { DuftHttpClient } from "./api/DuftHttpClient/DuftHttpClient";
import config from "./config";
import {
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
  updateConfigFromHttpClient,
  getRefreshToken,
} from "./api/DuftHttpClient/local-storage-functions";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);
const queryClient = new QueryClient();

export const client = new DuftHttpClient(
  config.apiBaseUrl,
  getTokenFromLocalStorage,
  setTokenInLocalStorage,
  updateConfigFromHttpClient,
  getRefreshToken
);

function Root() {
  const getPreferredMode = (): "dark" | "light" => 
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const [mode, setMode] = useState<"dark" | "light">(() => {
    const savedMode = localStorage.getItem("flowbite-theme-mode") as "dark" | "light";
    return savedMode || getPreferredMode();
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = (newMode: "dark" | "light") => {
      localStorage.setItem("flowbite-theme-mode", newMode);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newMode);
      setMode(newMode);
      document.documentElement.style.display = 'none';
      void document.documentElement.offsetHeight;
      document.documentElement.style.display = '';
    };

    // Initial theme sync
    updateTheme(mode);

    const handleChange = (event: MediaQueryListEvent) => {
      const newMode = event.matches ? "dark" : "light";
      requestAnimationFrame(() => {
        updateTheme(newMode);
      });
    };
    const checkThemeSync = () => {
      const storedMode = localStorage.getItem("flowbite-theme-mode") as "dark" | "light";
      const systemMode = getPreferredMode();
      if (storedMode && storedMode !== systemMode) {
        updateTheme(systemMode);
      }
    };

    // Add listeners
    mediaQuery.addEventListener("change", handleChange);
    document.addEventListener("visibilitychange", checkThemeSync);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      document.removeEventListener("visibilitychange", checkThemeSync);
    };
  }, []);

  return (
    <StrictMode>
      <Flowbite
        theme={{
          mode, // Dynamically set mode based on system preference
          theme, // Include your custom theme
        }}
      >
        <AppStateProvider>
          <QueryClientProvider client={queryClient}>
            <AppInitializer />
          </QueryClientProvider>
        </AppStateProvider>
      </Flowbite>
    </StrictMode>
  );
}

root.render(<Root />);
