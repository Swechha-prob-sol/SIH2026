import { useState } from "react";
import Sidebar, { type NavTab } from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import StandardsSearch from "./components/StandardsSearch";
import ComplianceChecker from "./components/ComplianceChecker";
import ExportReports from "./components/ExportReports";
import CertificationSchemes from "./components/CertificationSchemes";
import LanguageToggle from "./components/LanguageToggle";
import ThemeToggle from "./components/ThemeToggle";
import Toast, { type ToastMessage } from "./components/Toast";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

function MainContent() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<NavTab>("chat");
  const [initialQuery, setInitialQuery] = useState<string>("");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (text: string, type: "info" | "success" | "warning" = "info") => {
    setToast({
      id: String(Date.now()),
      text,
      type,
    });
  };

  const handleOpenInChat = (query: string) => {
    setInitialQuery(query);
    setActiveTab("chat");
    showToast(`Query sent to Live AI Assistant: "${query.substring(0, 45)}..."`, "info");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fa] transition-colors duration-150 dark:bg-slate-950">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onSelectQuery={handleOpenInChat}
        onToast={showToast}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 transition-colors duration-150 dark:border-slate-800 dark:bg-slate-900">
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

            <button
              onClick={() =>
                showToast(
                  "RAG Connectivity: Pinecone Index (117 Chunks) & Gemini 3.6 Flash Active",
                  "success"
                )
              }
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 transition hover:bg-slate-100 sm:flex dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750"
            >
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {t.systemOnline}
              </span>
            </button>
          </div>
        </header>

        {/* Subnav Tabs */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-2 transition-colors duration-150 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {/* BIS Standards / Chat */}
            <button
              onClick={() => setActiveTab("chat")}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md transition ${
                activeTab === "chat"
                  ? "bg-blue-900 text-white font-bold dark:bg-blue-600"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {t.navBisStandards} (AI Chat)
            </button>

            <span className="text-slate-300 dark:text-slate-600">•</span>

            {/* Standards Search */}
            <button
              onClick={() => setActiveTab("search")}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md transition ${
                activeTab === "search"
                  ? "bg-blue-900 text-white font-bold dark:bg-blue-600"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {t.navStandardsSearch}
            </button>

            <span className="text-slate-300 dark:text-slate-600">•</span>

            {/* Compliance */}
            <button
              onClick={() => setActiveTab("compliance")}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md transition ${
                activeTab === "compliance"
                  ? "bg-blue-900 text-white font-bold dark:bg-blue-600"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {t.navCompliance}
            </button>

            <span className="text-slate-300 dark:text-slate-600">•</span>

            {/* Certification Schemes */}
            <button
              onClick={() => setActiveTab("certification")}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md transition ${
                activeTab === "certification"
                  ? "bg-blue-900 text-white font-bold dark:bg-blue-600"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {t.navCertification}
            </button>

            <span className="text-slate-300 dark:text-slate-600">•</span>

            {/* Reports */}
            <button
              onClick={() => setActiveTab("reports")}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md transition ${
                activeTab === "reports"
                  ? "bg-blue-900 text-white font-bold dark:bg-blue-600"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Audit Reports
            </button>
          </div>
        </div>

        {/* Dynamic Tab Content Area */}
        <section className="min-h-0 flex-1 overflow-hidden">
          {activeTab === "chat" && (
            <ChatWindow
              initialQuery={initialQuery}
              onClearInitialQuery={() => setInitialQuery("")}
            />
          )}

          {activeTab === "search" && (
            <StandardsSearch
              onOpenInChat={handleOpenInChat}
              onToast={showToast}
            />
          )}

          {activeTab === "compliance" && (
            <ComplianceChecker
              onOpenInChat={handleOpenInChat}
              onToast={showToast}
            />
          )}

          {activeTab === "reports" && (
            <ExportReports
              onNavigateToCompliance={() => setActiveTab("compliance")}
              onOpenInChat={handleOpenInChat}
              onToast={showToast}
            />
          )}

          {activeTab === "certification" && (
            <CertificationSchemes
              onOpenInChat={handleOpenInChat}
              onToast={showToast}
            />
          )}
        </section>
      </main>

      {/* Global Interactive Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
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