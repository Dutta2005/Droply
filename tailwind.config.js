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
        primary: {
          DEFAULT: "#FFC107",
          50: "#FFF3E0",
          100: "#FFE0B2",
          200: "#FFCC80",
          300: "#FFB74D",
          400: "#FFA726",
          500: "#FF9800",
          600: "#FB8C00",
          700: "#F57C00",
          800: "#EF6C00",
          900: "#E65100",
          950: "#BF360C",
        },
        secondary: {
          DEFAULT: "#3F51B5",
          50: "#E8EAF6",
          100: "#C5CAE9",
          200: "#9FA8DA",
          300: "#7986CB",
          400: "#5C6BC0",
          500: "#3F51B5",
          600: "#3949AB",
          700: "#303F9F",
          800: "#283593",
          900: "#1A237E",
          950: "#0D1458",
        }
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};