/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounceMore: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-100%)" },
        },
      },
      animation: {
        "bounce-more": "bounceMore 1s infinite",
        "bounce-more-delay-1": "bounceMore 1s infinite 0.2s",
        "bounce-more-delay-2": "bounceMore 1s infinite 0.4s",
        "bounce-more-delay-3": "bounceMore 1s infinite 0.6s",
        "bounce-more-delay-4": "bounceMore 1s infinite 0.8s",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
