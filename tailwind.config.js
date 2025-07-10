// tailwind.config.js
import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(avatar|badge|button|card|divider|dropdown|input|modal|progress|table|tabs|toast|popover|ripple|spinner|menu|form|checkbox|spacer).js"
],
  theme: {
    extend: {
      colors: {
        default: {
          50:  "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        }
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};