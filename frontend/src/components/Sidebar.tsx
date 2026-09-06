import { useLanguage } from "../context/LanguageContext";

function Sidebar() {
    const { t } = useLanguage();

    return (
        <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-[#0F172A] transition-colors duration-150 dark:border-slate-800/80 dark:bg-[#090d16]">

            {/* Logo / Brand */}
            <div className="border-b border-slate-800/90 px-5 py-5 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-lg font-bold text-white shadow-sm dark:bg-blue-600">
                        BIS
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-100">
                            {t.sidebarTitle}
                        </h2>
                        <p className="text-xs text-slate-400">
                            {t.sidebarSubtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="px-4 py-5">

                <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600">
                    <span className="text-lg">+</span>
                    {t.newConversation}
                </button>

                <nav className="space-y-1">

                    <button className="flex w-full items-center gap-3 rounded-lg bg-blue-900/30 px-3 py-2.5 text-sm font-medium text-white dark:bg-blue-950/60 dark:text-blue-200">
                        <span>▣</span>
                        {t.menuStandardsSearch}
                    </button>

                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white dark:hover:bg-slate-800/60">
                        <span>✓</span>
                        {t.menuComplianceChecker}
                    </button>

                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white dark:hover:bg-slate-800/60">
                        <span>⇩</span>
                        {t.menuExportReports}
                    </button>

                </nav>
            </div>

            {/* Recent conversations */}
            <div className="flex-1 overflow-y-auto px-4">

                <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {t.recentConversations}
                </div>

                <div className="space-y-1">

                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white dark:hover:bg-slate-800/60">
                        {t.recentOverview}
                    </button>

                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white dark:hover:bg-slate-800/60">
                        {t.recentCement}
                    </button>

                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white dark:hover:bg-slate-800/60">
                        {t.recentSafety}
                    </button>

                </div>
            </div>

            {/* Bottom section */}
            <div className="border-t border-slate-800/90 p-4 dark:border-slate-800/60">

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800/80 hover:text-white dark:hover:bg-slate-800/60">
                    <span>⚙</span>
                    {t.settings}
                </button>

                <div className="mt-3 flex items-center gap-3 rounded-lg bg-slate-800/60 px-3 py-3 dark:bg-slate-900/80">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-xs font-semibold text-white dark:bg-blue-700">
                        AI
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-100">
                            {t.assistantName}
                        </p>

                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            <span className="text-xs text-slate-400 dark:text-slate-400">
                                {t.onlineStatus}
                            </span>
                        </div>
                    </div>

                </div>
            </div>

        </aside>
    );
}

export default Sidebar;