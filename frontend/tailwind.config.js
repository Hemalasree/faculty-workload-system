export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bgLight: "#F8FAFC",        // page background
        sidebar: "#EDE9FE",   // lavender pastel
        cardLight: "#FFFFFF",
        primary: "#7C9DFF",   // soft blue
        accent: "#A7F3D0",    // mint pastel
        border: "#E5E7EB",
        borderDark: "#334155",
        text: "#374151",
        bgDark: "#0F172A",
        cardDark: "#1E293B"
      },
      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,0.08)"   // ⭐ ADD THIS
      }
    }
  },
  plugins: []
};