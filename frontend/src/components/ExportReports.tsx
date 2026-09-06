import { useState } from "react";
import { DEMO_PAST_REPORTS, type PastReport } from "../data/demoData";

interface ExportReportsProps {
  onNavigateToCompliance: () => void;
  onOpenInChat: (query: string) => void;
  onToast: (msg: string, type?: "info" | "success" | "warning") => void;
}

export default function ExportReports({
  onNavigateToCompliance,
  onOpenInChat,
  onToast,
}: ExportReportsProps) {
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedReport, setSelectedReport] = useState<PastReport | null>(null);

  const filteredReports = DEMO_PAST_REPORTS.filter((r) => {
    if (filterStatus === "All") return true;
    return r.status === filterStatus;
  });

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f5f7fa] px-4 py-6 transition-colors duration-150 sm:px-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-900 text-xs font-bold text-white dark:bg-blue-600">
                ⇩
              </span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Compliance Audit & Export Reports
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Archived Bureau of Indian Standards laboratory audit reports and conformity certificates
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onToast("Export feature coming in full release", "info")
              }
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850"
            >
              Export CSV Index
            </button>

            <button
              onClick={onNavigateToCompliance}
              className="rounded-xl bg-blue-900 px-4 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              + New Evaluation
            </button>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Filter:
          </span>
          {["All", "Compliant", "Review Required"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-lg px-3 py-1.5 font-medium transition ${
                filterStatus === st
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-850"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isCompliant = report.status === "Compliant";
            return (
              <div
                key={report.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    {/* ID & Date */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {report.id}
                      </span>
                      <span>•</span>
                      <span>{report.date}</span>
                      <span>•</span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {report.sector}
                      </span>
                    </div>

                    {/* Report Title */}
                    <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                      {report.title}
                    </h3>

                    {/* Standard Tag */}
                    <p className="mt-1 text-xs text-blue-900 dark:text-blue-400 font-medium">
                      Standard: {report.standardCode} ({report.standardName})
                    </p>

                    {/* Summary */}
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {report.summary}
                    </p>

                    {/* Evaluator lab */}
                    <p className="mt-2 text-[11px] text-slate-400">
                      Testing Laboratory: {report.evaluator}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold ${
                        isCompliant
                          ? "border border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "border border-amber-500/30 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      <span>{isCompliant ? "✅" : "⚠️"}</span>
                      <span>{report.status}</span>
                    </span>
                  </div>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                  <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                    <span>
                      Parameters Tested: <strong className="text-slate-800 dark:text-slate-200">{report.metrics.tested}</strong>
                    </span>
                    <span>
                      Passed: <strong className="text-emerald-700 dark:text-emerald-400">{report.metrics.passed}</strong>
                    </span>
                    {report.metrics.flags > 0 && (
                      <span>
                        Deficits: <strong className="text-amber-700 dark:text-amber-400">{report.metrics.flags}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850"
                    >
                      View Certificate
                    </button>

                    <button
                      onClick={() =>
                        onToast("Export feature coming in full release", "info")
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      <span>⇩</span>
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal / Overlay for "View Certificate" */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-900 text-xs text-white">
                    BIS
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Conformity Audit Record
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕ Close
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Report Identifier:
                  </span>{" "}
                  <span className="font-mono text-slate-900 dark:text-slate-100">
                    {selectedReport.id}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Audit Subject:
                  </span>{" "}
                  <span className="text-slate-900 dark:text-slate-100">
                    {selectedReport.title}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Applicable Standard:
                  </span>{" "}
                  <span className="text-blue-900 dark:text-blue-400 font-medium">
                    {selectedReport.standardCode}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Audit Date:
                  </span>{" "}
                  <span>{selectedReport.date}</span>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Accredited Laboratory:
                  </span>{" "}
                  <span>{selectedReport.evaluator}</span>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 leading-relaxed text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  <span className="font-semibold">Laboratory Findings:</span>{" "}
                  {selectedReport.summary}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  onClick={() => {
                    onOpenInChat(
                      `What are the typical non-conformance penalties and re-audit guidelines under ${selectedReport.standardCode}?`
                    );
                    setSelectedReport(null);
                  }}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-850"
                >
                  Ask AI About Guidelines
                </button>

                <button
                  onClick={() => {
                    onToast("Export feature coming in full release", "info");
                    setSelectedReport(null);
                  }}
                  className="rounded-xl bg-blue-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
