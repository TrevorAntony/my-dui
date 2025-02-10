import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from `.env` files
dotenv.config();

// ----------------------------------------------------------------------

//@ts-expect-error the defineConfig type is not correct, it should include the test property
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), "node_modules/$1"),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1"),
      },
    ],
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3031,
    //TO-DO: add support for multiple proxies for fetching URL data
    proxy: {
      "/omrsProxy": {
        target: "https://dev3.openmrs.org/openmrs/ws/rest/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/omrsProxy/, ""),
      },
    },
  },
  preview: {
    port: 3031,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./setupTests.ts", // Path to your test setup file
  },
});
