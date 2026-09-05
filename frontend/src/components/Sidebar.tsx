function Sidebar() {
    return (
        <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-slate-800 bg-[#0F172A]">

            {/* Logo / Brand */}
            <div className="border-b border-slate-800 px-5 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-lg font-bold text-white">
                        BIS
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-100">
                            BIS Assistant
                        </h2>
                        <p className="text-xs text-slate-400">
                            Standards Intelligence
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="px-4 py-5">

                <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-800">
                    <span className="text-lg">+</span>
                    New Conversation
                </button>

                <nav className="space-y-1">

                    <button className="flex w-full items-center gap-3 rounded-lg bg-blue-900/30 px-3 py-2.5 text-sm font-medium text-white">
                        <span>▣</span>
                        Standards Search
                    </button>

                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">
                        <span>✓</span>
                        Compliance Checker
                    </button>

                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">
                        <span>⇩</span>
                        Export Reports
                    </button>

                </nav>
            </div>

            {/* Recent conversations */}
            <div className="flex-1 overflow-y-auto px-4">

                <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Recent Conversations
                </div>

                <div className="space-y-1">

                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800">
                        BIS standards overview
                    </button>

                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800">
                        Cement quality requirements
                    </button>

                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800">
                        Safety standards query
                    </button>

                </div>
            </div>

            {/* Bottom section */}
            <div className="border-t border-slate-800 p-4">

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white">
                    <span>⚙</span>
                    Settings
                </button>

                <div className="mt-3 flex items-center gap-3 rounded-lg bg-slate-800/60 px-3 py-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-xs font-semibold text-white">
                        AI
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-100">
                            BIS AI Assistant
                        </p>

                        <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            <span className="text-xs text-slate-500">
                                Online
                            </span>
                        </div>
                    </div>

                </div>
            </div>

        </aside>
    );
}

export default Sidebar;