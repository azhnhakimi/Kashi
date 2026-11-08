/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        kashi: {
          bg: "#01010D",
          card: "#10101D",
          surface: "#171725",
          border: "#292839",
          accent: "#6331FB",
          text: {
            primary: "#FFFFFF",
            secondary: "#A5A3B5",
            muted: "#6F6D80",
          },
          positive: "#4ADE80",
          negative: "#F87171",
        },
        category: {
          food: "#F59E0B",
          transport: "#3B82F6",
          shopping: "#EC4899",
          entertainment: "#A78BFA",
          bills: "#EAB308",
          healthcare: "#22C55E",
          education: "#06B6D4",
          others: "#9CA3AF",
        },
      },
    },
  },
  plugins: [],
};
