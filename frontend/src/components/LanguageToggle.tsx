import React from "react";
import { useLanguage } from "../context/LanguageContext";

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language Selector"
      className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium text-slate-600 shadow-xs dark:border-slate-700 dark:bg-slate-800"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`rounded-md px-2.5 py-1 transition-all ${
          language === "en"
            ? "bg-white font-semibold text-blue-950 shadow-xs ring-1 ring-slate-900/5 dark:bg-slate-700 dark:text-slate-100"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        className={`rounded-md px-2.5 py-1 transition-all ${
          language === "hi"
            ? "bg-white font-semibold text-blue-950 shadow-xs ring-1 ring-slate-900/5 dark:bg-slate-700 dark:text-slate-100"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        हिन्दी
      </button>
    </div>
  );
};

export default LanguageToggle;
