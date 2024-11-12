import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./index.css";
import App from "./App";
import { AppStateProvider } from "./AppStateContext";
import { ConfigProvider } from "./context/ConfigContext";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
  <StrictMode>
    <AppStateProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <App />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </ConfigProvider>
      </QueryClientProvider>
    </AppStateProvider>
  </StrictMode>,
);
