/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3B82F6",
          electric: "#60A5FA",
          purple: "#8B5CF6",
          violet: "#6D28D9",
          lavender: "#C4B5FD",
          bg: "#080B18",
          bgCard: "#10152B",
          text: "#F8FAFC",
          muted: "#A5B4CF",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #3B82F6 0%, #6366F1 45%, #8B5CF6 100%)",
        "gradient-glow": "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15), transparent 70%)",
        "gradient-card": "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-glow": "0 0 25px -5px rgba(99, 102, 241, 0.3)",
        "glow-lg": "0 0 50px -10px rgba(139, 92, 246, 0.35)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
