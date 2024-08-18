import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { AppStateProvider } from "./AppStateContext";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </StrictMode>
);
