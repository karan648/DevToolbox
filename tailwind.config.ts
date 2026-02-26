import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.{css,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        border: "hsl(var(--border))",
        yellow: "#FFD600",
        blue: "#3B82F6",
        green: "#22C55E",
        coral: "#FF4D6D",
        orange: "#FB923C",
        ink: "#000000",
        shell: "#0F172A",
      },
      boxShadow: {
        brutal: "6px 6px 0 #000000",
        "brutal-sm": "3px 3px 0 #000000",
      },
      borderRadius: {
        brutal: "18px",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        popIn: {
          "0%": { transform: "scale(0.98)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pop-in": "popIn 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
