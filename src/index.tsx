import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppStateProvider } from "./context/AppStateContext";
import AppInitializer from "./ui-components/app-initializer";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        <AppInitializer />
      </AppStateProvider>
    </QueryClientProvider>
  </StrictMode>
);
