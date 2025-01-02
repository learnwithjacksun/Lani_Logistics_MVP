/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit, sans-serif"],
        dm: ["DM Sans, sans-serif"],
      },
      colors: {
        primary_1: "var(--primary-1)",    
        primary_2: "var(--primary-2)",    
        secondary: "var(--secondary)",  
        background: "var(--background)",  
        background_2: "var(--background-2)",  
        line: "var(--line)",  
        main: "var(--main)",
        sub: "var(--sub)",    
        mid: "var(--mid)",    
      },
      textShadow: {
        'default': '0 2px 4px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
}