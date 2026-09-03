import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Space Blue design system
        surface: {
          0: "var(--surface-0)", // page background
          1: "var(--surface-1)", // card
          2: "var(--surface-2)", // elevated card / column
          3: "var(--surface-3)", // hover state
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          active: "var(--accent-active)",
        },

        // Also expose raw Deep Space Blue scale if you want direct usage
        "deep-space-blue": {
          50: "var(--color-deep-space-blue-50)",
          100: "var(--color-deep-space-blue-100)",
          200: "var(--color-deep-space-blue-200)",
          300: "var(--color-deep-space-blue-300)",
          400: "var(--color-deep-space-blue-400)",
          500: "var(--color-deep-space-blue-500)",
          600: "var(--color-deep-space-blue-600)",
          700: "var(--color-deep-space-blue-700)",
          800: "var(--color-deep-space-blue-800)",
          900: "var(--color-deep-space-blue-900)",
          950: "var(--color-deep-space-blue-950)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)",
        elevated: "0 4px 16px rgba(0,0,0,0.6)",
      },
      animation: {
        "fade-in": "fadeIn 150ms ease-out",
        "slide-up": "slideUp 200ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
