import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppStateProvider } from "./context/AppStateContext";
import AppInitializer from "./ui-components/app-initializer";

import "./index.css";
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
  const [mode, setMode] = useState<"dark" | "light">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = (newMode: "dark" | "light") => {
      setMode(newMode);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newMode);
    };

    // Initial sync to DOM
    updateTheme(mode);

    const handleChange = (event: MediaQueryListEvent) => {
      const newMode = event.matches ? "dark" : "light";
      updateTheme(newMode);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [mode]);

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
