import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from `.env` files
dotenv.config();

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
  ],
  base: './',
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    }
  },
  server: {
    port: 3031,
  },
  preview: {
    port: 3031,
  },
});
