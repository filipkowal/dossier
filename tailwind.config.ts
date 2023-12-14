import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "digitalent-green": {
          DEFAULT: "#66B573",
          light: "#D7E4DD",
        },
        "digitalent-gray": {
          light: "#F2F2F2",
          dark: "#131313",
        },
        "digitalent-yellow": {
          DEFAULT: "#E7E248",
        },
        "digitalent-blue": {
          DEFAULT: "#193B44",
        },
        "digitalent-mine": {
          DEFAULT: "#363636",
        },
      },
      screens: {
        "2xl": "1536px",
        "3xl": "1920px",
      },
      height: {
        initial: "initial",
      },
    },
    fontFamily: {
      sans: ["var(--font-inter)", "sans-serif"],
      title: ["var(--font-stolzl)", "sans-serif"],
      serif: ["var(--font-merriweather)", "serif"],
      logo: ["var(--font-loew)", "sans-serif"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-animate"),
    function ({ addBase }) {
      addBase({
        "@screen 3xl": {
          html: { zoom: "125%" }, // adjust the zoom level as needed
        },
      });
    },
  ],
};
export default config;
