import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Neutral ramp — cool avionics slate (replaces default gray/zinc).
        ink: {
          50: "#F4F6F8",
          100: "#E8EDF2",
          200: "#D2DAE3",
          300: "#AEB9C6",
          400: "#8A97A8",
          500: "#6B7888",
          600: "#5A6677",
          700: "#3A4452",
          800: "#1F2630",
          850: "#1A2230",
          900: "#121822",
          950: "#0A0E14",
        },
        // Primary accent — runway/caution-light amber ("clear for takeoff").
        signal: {
          50: "#FFF8EC",
          100: "#FCEFCF",
          200: "#F9DF9F",
          300: "#F6CA63",
          400: "#F5B53C",
          500: "#F5A623",
          600: "#DB8A0E",
          700: "#B66D0C",
          800: "#8F5410",
          900: "#743F12",
          950: "#422106",
        },
        // Support accent — instrument/horizon teal, used sparingly.
        horizon: {
          50: "#ECFBF7",
          100: "#CFF5EC",
          200: "#9FEBDB",
          300: "#5FDCC5",
          400: "#2DD4BF",
          500: "#16B8A4",
          600: "#0E9485",
          700: "#0F766B",
          800: "#115E56",
          900: "#134E48",
          950: "#042F2C",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-display)", "var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
    },
  },
  plugins: [],
};
export default config;
