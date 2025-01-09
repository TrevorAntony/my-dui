/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./node_modules/flowbite-react/lib/**/*.{js,ts}",
    "./src/**/*.{ts,tsx}",
    "../duft-config/**/*.html"
  ],
  corePlugins: {
    preflight: true, // Optional, to ensure no conflicts
  },
  experimental: {
    optimizeUniversalDefaults: true, // Optional, for better optimisation
  },
  theme: {
    colors: {
      primary: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
      },
      highlight: {
        DEFAULT: "var(--highlight-color)", // Use the CSS variable for the default color
        50: "#fff5fa", // Extremely light magenta (almost white)
        100: "#ffebf2", // Very light magenta
        150: "#ffd6e5", // Light pastel magenta
        200: "#ffbfd7", // Light magenta
        300: "#ff99b3", // Soft magenta
        400: "#ff73a0", // Medium magenta
        500: "var(--highlight-color)", // Base magenta
        600: "#e05288", // Slightly darker magenta
        700: "#b8396f", // Dark magenta
        800: "#922157", // Very dark magenta
        850: "#7a1b47", // Deeper dark magenta
        900: "#611437", // Deepest magenta
        950: "#490e27", // Extremely dark magenta (almost black)
      },
    },
    fontFamily: {
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      body: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            /* Add this to customize table styles */
            table: {
              tableLayout: "auto",
              width: "100%",
            },
            thead: {
              borderBottom: "1px solid #ccc",
            },
            "thead th": {
              padding: "0.5em",
              fontWeight: "600",
              textAlign: "left",
              borderRight:
                "1px solid #ccc" /* Add right border to header cells */,
            },
            "tbody td": {
              padding: "0.5em",
              borderBottom: "1px solid #eee",
              borderRight:
                "1px solid #eee" /* Add right border to body cells */,
            },
            "th:last-child, td:last-child": {
              borderRight:
                "none" /* Remove right border from last column cells */,
            },
          },
        },
      },
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          dark: "#93c5fd",
        },
        highlight: {
          DEFAULT: "var(--highlight-color)",
          dark: "#ffbfd7",
        },
      },
      textColor: {
        DEFAULT: "#1e293b", // Default text colour for light mode
        dark: "#f8fafc", // Default text colour for dark mode
        primary: {
          DEFAULT: "#2563eb", // Your primary colour
          dark: "#93c5fd", // Lighter variant for dark mode
        },
        highlight: {
          DEFAULT: "var(--highlight-color)",
          dark: "#ffbfd7",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("@tailwindcss/typography")],
};
