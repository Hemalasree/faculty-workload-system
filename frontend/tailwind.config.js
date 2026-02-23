/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f19",
        card: "#111827",
        border: "#1f2937"
      }
    }
  },
  plugins: []
};
