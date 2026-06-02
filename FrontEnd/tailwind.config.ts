// tailwind.config.ts
import { type Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f8f7f3", // استخوانی
        primary: "#00bfa6",    // فیروزه‌ای
        dark: "#121212",       // سیاه/تیره
      },
    },
  },
  plugins: [],
}

export default config
