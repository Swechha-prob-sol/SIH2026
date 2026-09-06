import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.themeToggle}
      className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium text-slate-600 shadow-xs dark:border-slate-700 dark:bg-slate-800"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        title={t.themeLight}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
          theme === "light"
            ? "bg-white font-semibold text-blue-950 shadow-xs ring-1 ring-slate-900/5 dark:bg-slate-700 dark:text-slate-100"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <span>☀️</span>
        <span>{t.themeLight}</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        title={t.themeDark}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-all ${
          theme === "dark"
            ? "bg-white font-semibold text-blue-950 shadow-xs ring-1 ring-slate-900/5 dark:bg-slate-700 dark:text-slate-100"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <span>🌙</span>
        <span>{t.themeDark}</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
