import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import LanguageToggle from "./components/LanguageToggle";
import ThemeToggle from "./components/ThemeToggle";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

function MainContent() {
  const { t } = useLanguage();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fa] transition-colors duration-150 dark:bg-slate-950">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 transition-colors duration-150 dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t.appTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.appSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <LanguageToggle />

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex dark:border-slate-700 dark:bg-slate-800">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {t.systemOnline}
              </span>
            </div>
          </div>
        </header>

        <div className="border-b border-slate-200 bg-white px-6 py-2 transition-colors duration-150 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span className="whitespace-nowrap text-blue-900 dark:text-blue-400">
              {t.navBisStandards}
            </span>

            <span className="text-slate-300 dark:text-slate-600">•</span>

            <span className="whitespace-nowrap">
              {t.navStandardsSearch}
            </span>

            <span className="text-slate-300 dark:text-slate-600">•</span>

            <span className="whitespace-nowrap">
              {t.navCompliance}
            </span>

            <span className="text-slate-300 dark:text-slate-600">•</span>

            <span className="whitespace-nowrap">
              {t.navCertification}
            </span>
          </div>
        </div>

        <section className="min-h-0 flex-1">
          <ChatWindow />
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;