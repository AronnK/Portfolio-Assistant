"use client";
import { useState } from "react";

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const themeClasses = {
    background: isDark
      ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
      : "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
  };

  return { isDark, toggleTheme, themeClasses };
};
