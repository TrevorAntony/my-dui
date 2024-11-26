import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppStateProvider } from "./context/AppStateContext";
import AppInitializer from "./ui-components/app-initializer";

import { Flowbite } from "flowbite-react";
import theme from "./flowbite-theme";

import "./index.css";
import "./input.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);
const queryClient = new QueryClient();

function Root() {
  const getPreferredMode = (): "dark" | "light" =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  const [mode, setMode] = useState<"dark" | "light">(getPreferredMode());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = (newMode: "dark" | "light") => {
      setMode(newMode);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newMode);
    };

    // Sync the mode on first render
    updateTheme(getPreferredMode());

    const handleChange = (event: MediaQueryListEvent) => {
      const newMode = event.matches ? "dark" : "light";
      updateTheme(newMode);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
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
