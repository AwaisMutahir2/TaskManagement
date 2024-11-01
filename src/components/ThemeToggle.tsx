"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full ${theme ==="light" ? "bg-gray-200" : "bg-gray-800"} `}
    >
      {theme !== "light" ? "🌙" : "☀️"}
    </button>
  );
}
