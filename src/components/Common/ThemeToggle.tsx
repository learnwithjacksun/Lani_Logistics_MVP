import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    setIsDark(theme === "dark");
    document.documentElement.className = theme;
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-background_2 rounded-full"
    >
      {isDark ? (
        <Sun size={20} className="text-main" />
      ) : (
        <Moon size={20} className="text-main" />
      )}
    </button>
  );
};

export default ThemeToggle; 