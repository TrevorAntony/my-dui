const config = {
  apiBaseUrl: import.meta.env["VITE_DUFT_SERVER_APP_BASE_URL"],
  debugMode: import.meta.env["VITE_DEBUG_MODE"],
  dataConnection: import.meta.env["VITE_DUFT_DATA_CONNECTION"],
  title: import.meta.env["VITE_DUFT_TITLE"],
};

export default config;
