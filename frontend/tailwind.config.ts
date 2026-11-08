import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6F7F9",
        ink: "#16181D",
        signal: "#6C7BFF",
        success: "#34C77B",
        error: "#F2555A",
        warning: "#F5A524",
        "border-subtle": "#E5E7EB",
        divider: "#E5E7EB",
        muted: "#6B7280",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

