import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#EDEAE1",
        "paper-raised": "#F5F2EA",
        ink: "#20262E",
        "ink-soft": "#5B6472",
        accent: "#B8863B",
        "accent-soft": "#F0E4C8",
        line: "#D9D4C7",
      },
    },
  },
  plugins: [],
};

export default config;