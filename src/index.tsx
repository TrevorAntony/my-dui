import { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppStateProvider } from "./context/AppStateContext";
import AppInitializer from "./app/app-initializer";

import { Flowbite } from "flowbite-react";
import theme from "./flowbite-theme";

import "./index.css";
import "./input.css";
import { ThemeModeProvider, useThemeMode } from "./context/ThemeModeContext";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);
const queryClient = new QueryClient();

function Root() {
  return (
    <StrictMode>
      <ThemeModeProvider>
        <FlowbiteWrapper>
          <AppStateProvider>
            <QueryClientProvider client={queryClient}>
              <AppInitializer />
            </QueryClientProvider>
          </AppStateProvider>
        </FlowbiteWrapper>
      </ThemeModeProvider>
    </StrictMode>
  );
}
function FlowbiteWrapper({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();
  const flowbiteTheme = useMemo(
    () => ({
      theme,
      mode,
    }),
    [mode]
  );

  return <Flowbite theme={flowbiteTheme}>{children}</Flowbite>;
}

root.render(<Root />);
