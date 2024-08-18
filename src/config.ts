const config = {
  apiBaseUrl:
    import.meta.env.VITE_DUFT_SERVER_APP_BASE_URL ||
    "http://127.0.0.1:8000/api/v2",
};

export default config;
