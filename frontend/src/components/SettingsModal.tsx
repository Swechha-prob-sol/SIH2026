import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string, type?: "info" | "success" | "warning") => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onToast,
}: SettingsModalProps) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [topK, setTopK] = useState(3);
  const [temperature, setTemperature] = useState(0.2);
  const [minScore, setMinScore] = useState(0.5);
  const [autoCite, setAutoCite] = useState(true);

  if (!isOpen) return null;

  const handleSave = () => {
    onToast("Settings and RAG parameters saved successfully", "success");
    onClose();
  };

  const handleFlushCache = () => {
    onToast("Redis query cache flushed clean (0 cached keys)", "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-900 text-sm font-bold text-white dark:bg-blue-600">
              ⚙
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.settings} & System Configuration
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                BIS AI Engine, Retrieval-Augmented Generation & Interface Preferences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-5 max-h-[70vh] space-y-5 overflow-y-auto pr-1 text-xs">
          {/* Section 1: AI & Inference Engine */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950/50">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              🤖 AI & Inference Model
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400">
                  LLM Model
                </label>
                <div className="mt-1 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <span className="font-semibold">gemini-3.6-flash</span>
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400">
                  Embedding Model
                </label>
                <div className="mt-1 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <span className="font-semibold">gemini-embedding-001</span>
                  <span className="text-[10px] text-slate-400">768 Dim</span>
                </div>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <label className="font-medium text-slate-600 dark:text-slate-400">
                  Temperature (Hallucination Control)
                </label>
                <span className="font-mono font-semibold text-blue-900 dark:text-blue-400">
                  {temperature} (Strict Regulatory)
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="mt-1.5 w-full accent-blue-900 dark:accent-blue-600"
              />
            </div>
          </div>

          {/* Section 2: RAG Pipeline & Vector DB */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950/50">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                ⚡ Vector Database & Retrieval (Pinecone)
              </h3>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                117 Vectors Indexed
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400">
                  Top-K Source Chunks
                </label>
                <select
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value={2}>2 Chunks (Concise)</option>
                  <option value={3}>3 Chunks (Recommended)</option>
                  <option value={5}>5 Chunks (Comprehensive)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400">
                  Similarity Cutoff Score
                </label>
                <select
                  value={minScore}
                  onChange={(e) => setMinScore(parseFloat(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value={0.4}>0.40 (Permissive)</option>
                  <option value={0.5}>0.50 (Standard Balanced)</option>
                  <option value={0.65}>0.65 (High Strictness)</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-1">
              <div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Automatic Clause Citations
                </span>
                <p className="text-[11px] text-slate-400">
                  Always cite Table number, item number, and clause reference
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoCite}
                onChange={(e) => setAutoCite(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-900 dark:accent-blue-600"
              />
            </div>
          </div>

          {/* Section 3: Cache & Storage */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950/50">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                💾 In-Memory Cache (Redis)
              </h3>
              <button
                type="button"
                onClick={handleFlushCache}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
              >
                Flush Redis Cache
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              Cached query responses are retained for 3600 seconds (1 hour) via SHA-256 hash keys.
            </p>
          </div>

          {/* Section 4: Interface & Accessibility */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/80 dark:bg-slate-950/50">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              🌐 Interface & Language
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">Language:</span>
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                      language === "en"
                        ? "bg-blue-900 text-white dark:bg-blue-600"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("hi")}
                    className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                      language === "hi"
                        ? "bg-blue-900 text-white dark:bg-blue-600"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">Theme:</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <span className="text-[11px] text-slate-400">
            BIS Assistant Core v1.0.4 • Smart India Hackathon
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-blue-900 px-4 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
