import { useState, useMemo } from "react";
import { DEMO_STANDARDS, type StandardItem } from "../data/demoData";

interface StandardsSearchProps {
  onOpenInChat: (query: string) => void;
  onToast: (msg: string, type?: "info" | "success" | "warning") => void;
}

export default function StandardsSearch({
  onOpenInChat,
  onToast,
}: StandardsSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sectors = useMemo(() => {
    const list = Array.from(new Set(DEMO_STANDARDS.map((s) => s.sector)));
    return ["All", ...list];
  }, []);

  const filteredStandards = useMemo(() => {
    return DEMO_STANDARDS.filter((s) => {
      const matchesSector =
        selectedSector === "All" || s.sector === selectedSector;
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.code.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);
      return matchesSector && matchesSearch;
    });
  }, [searchTerm, selectedSector]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f5f7fa] px-4 py-6 transition-colors duration-150 sm:px-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header Title & Info */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-900 text-xs font-bold text-white dark:bg-blue-600">
                IS
              </span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                National Standards Directory
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Explore verified Indian Standards formulated by the Bureau of Indian Standards (BIS)
            </p>
          </div>

          <button
            onClick={() =>
              onToast(
                "Standards database refreshed with latest BIS Gazetted Gazette Notifications (2026)",
                "success"
              )
            }
            className="self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850"
          >
            ↻ Sync Gazette Directory
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900">
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              🔍
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by standard number (e.g. IS 10500, IS 1599), keyword, or material..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-900 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sector Filter Chips */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sectors:
            </span>
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  selectedSector === sec
                    ? "bg-blue-900 text-white dark:bg-blue-600"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredStandards.length}</strong> of {DEMO_STANDARDS.length} curated Indian Standards
          </span>
          {searchTerm && (
            <span className="italic">Filtered by keyword &ldquo;{searchTerm}&rdquo;</span>
          )}
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredStandards.map((std: StandardItem) => {
            const isExpanded = expandedId === std.id;
            return (
              <div
                key={std.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-900 dark:bg-blue-950/80 dark:text-blue-300">
                      {std.code}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {std.sector}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {std.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {std.description}
                  </p>

                  {/* Primary Clause Reference */}
                  <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-2 text-[11px] text-slate-600 dark:border-slate-800/80 dark:bg-slate-950/60 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Key Reference:
                    </span>{" "}
                    {std.keyClause}
                  </div>

                  {/* Expandable Parameters Table */}
                  {isExpanded && (
                    <div className="mt-3 space-y-2 rounded-xl border border-blue-100 bg-blue-50/40 p-3 text-xs dark:border-blue-900/40 dark:bg-blue-950/20">
                      <p className="font-semibold text-blue-900 dark:text-blue-300">
                        Prescribed Regulatory Parameters:
                      </p>
                      <div className="divide-y divide-blue-100 dark:divide-blue-900/30">
                        {std.parameters.map((p, idx) => (
                          <div key={idx} className="py-1.5 first:pt-0 last:pb-0">
                            <div className="flex items-center justify-between font-medium text-slate-800 dark:text-slate-200">
                              <span>{p.name}</span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {p.clause}
                              </span>
                            </div>
                            <div className="mt-0.5 flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
                              <span>
                                Acceptable: <strong className="text-emerald-700 dark:text-emerald-400">{p.acceptable} {p.unit}</strong>
                              </span>
                              <span>•</span>
                              <span>
                                Permissible: <strong className="text-amber-700 dark:text-amber-400">{p.permissible}</strong>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    onClick={() => toggleExpand(std.id)}
                    className="text-xs font-medium text-slate-600 transition hover:text-blue-900 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    {isExpanded ? "▲ Hide Specifications" : "▼ View Specifications"}
                  </button>

                  <button
                    onClick={() => {
                      onOpenInChat(
                        `What are the mandatory testing requirements and limits under ${std.code} (${std.title})?`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-3 py-1.5 text-xs font-medium text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    <span>Ask AI</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
