import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f7ff",
          100: "#bae7ff",
          200: "#91d5ff",
          300: "#69c0ff",
          400: "#40a9ff",
          500: "#1890ff",
          600: "#0070d9",
          700: "#0050b3",
          800: "#003a8c",
          900: "#002766"
        },
        accent: {
          50: "#fff7e6",
          100: "#ffe7ba",
          200: "#ffd591",
          300: "#ffc069",
          400: "#ffa940",
          500: "#ff8f1f",
          600: "#fa8c16",
          700: "#d46b08",
          800: "#ad4e00",
          900: "#873800"
        }
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;

