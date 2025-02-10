import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Add this import
import { defineConfig as defineVitestConfig } from "vitest/config";

// Merge configurations
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
  // Add test configuration here
  define: {
    "import.meta.vitest": "undefined",
  },
} as any);

// Add separate Vitest config
export const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
