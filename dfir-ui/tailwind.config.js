
const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        sidebar: {
          start: "#0f3d4d",
          mid: "#1e615d",
          end: "#4e2a84",
        },
      },
    },
  },
  plugins: [],
};

export default config;
