export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Playfair Display'", "serif"]
      },
      colors: {
        // Light mode
        bgLight:    "#F0F4FF",
        sideLight:  "#EDE9FE",
        cardLight:  "#FFFFFF",
        primary:    "#6B8EFF",
        primaryHov: "#5A7BFF",
        accent:     "#A7F3D0",
        accentPink: "#FBCFE8",
        accentPeach:"#FED7AA",
        border:     "#E5E7EB",
        textMain:   "#374151",
        textMuted:  "#6B7280",
        // Status
        statusGreen: "#D1FAE5",
        statusGreenText: "#065F46",
        statusYellow: "#FEF3C7",
        statusYellowText: "#92400E",
        statusRed:   "#FEE2E2",
        statusRedText:"#991B1B",
        // Dark mode
        bgDark:     "#0F172A",
        sideDark:   "#1E1B4B",
        cardDark:   "#1E293B",
        borderDark: "#334155"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem"
      },
      boxShadow: {
        card: "0 2px 15px rgba(0,0,0,0.06)",
        cardHov: "0 8px 30px rgba(0,0,0,0.1)"
      }
    }
  },
  plugins: []
};