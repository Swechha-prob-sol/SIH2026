import { useState } from "react";
import {
  DEMO_STANDARDS,
  DEMO_COMPLIANCE_PRESETS,
  type CompliancePreset,
} from "../data/demoData";

interface ComplianceCheckerProps {
  onOpenInChat: (query: string) => void;
  onToast: (msg: string, type?: "info" | "success" | "warning") => void;
}

export default function ComplianceChecker({
  onOpenInChat,
  onToast,
}: ComplianceCheckerProps) {
  // Form State
  const [productName, setProductName] = useState("Treated Municipal Potable Water");
  const [material, setMaterial] = useState("Potable Water (Piped Supply)");
  const [specName, setSpecName] = useState("Total Dissolved Solids (TDS)");
  const [specValue, setSpecValue] = useState("480");
  const [standardCode, setStandardCode] = useState("IS 10500:2012");
  const [isChecking, setIsChecking] = useState(false);
  const [report, setReport] = useState<CompliancePreset | null>(
    DEMO_COMPLIANCE_PRESETS[0]
  );

  const handleApplyPreset = (preset: CompliancePreset) => {
    setProductName(preset.productName);
    setMaterial(preset.material);
    setSpecName(preset.specName);
    setSpecValue(preset.specValue);
    setStandardCode(preset.standardCode);
    setReport(preset);
    onToast(`Loaded preset for ${preset.productName}`, "info");
  };

  const handleRunCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);

    setTimeout(() => {
      setIsChecking(false);

      // Match preset if exists or generate dynamic realistic result
      const matched = DEMO_COMPLIANCE_PRESETS.find(
        (p) => p.standardCode === standardCode
      );

      if (matched) {
        setReport({
          ...matched,
          productName: productName || matched.productName,
          material: material || matched.material,
          specValue: specValue || matched.specValue,
        });
      } else {
        // Fallback realistic compliance result
        setReport({
          label: `${productName} Evaluation`,
          productName: productName || "Industrial Test Sample",
          material: material || "Standard Specimen",
          standardCode: standardCode,
          specName: specName || "Key Physical Property",
          specValue: specValue || "Verified Metric",
          expectedStatus: "compliant",
          reportSummary: `Sample conforms to regulatory criteria stipulated in ${standardCode}. Parameter ${specName || "Observed value"} (${specValue}) is within normal operating tolerance for industrial application.`,
          clauseRef: `${standardCode} General Acceptance Specification`,
          details: {
            parameter: specName || "Tested Parameter",
            observed: `${specValue}`,
            acceptable: "Within Standard Range",
            permissible: "Upper Margin Compliant",
            statusText: "COMPLIANT: Tested sample fulfills baseline requirements.",
          },
        });
      }

      onToast("Compliance verification complete against BIS rules", "success");
    }, 450);
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f5f7fa] px-4 py-6 transition-colors duration-150 sm:px-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-xs font-bold text-white dark:bg-emerald-600">
              ✓
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Automated Compliance Evaluator
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Audit test parameters against Bureau of Indian Standards requirements with clause-level verification
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              ⚡ Quick Test Presets (1-Click Sample Evaluation):
            </span>
            <span className="text-[11px] text-slate-400">
              Select a real scenario to test
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {DEMO_COMPLIANCE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  report?.label === preset.label
                    ? "border-blue-700 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-200"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Evaluation Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Product & Parameter Specifications
          </h2>

          <form onSubmit={handleRunCheck} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Product Name
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Treated Potable Water Batch #4"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500"
              />
            </div>

            {/* Material / Category */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Material / Industry Classification
              </label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Potable Water / Municipal"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500"
              />
            </div>

            {/* Key Specification Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Parameter Tested
              </label>
              <input
                type="text"
                required
                value={specName}
                onChange={(e) => setSpecName(e.target.value)}
                placeholder="e.g. Total Dissolved Solids (TDS)"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500"
              />
            </div>

            {/* Key Specification Value */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Observed Test Value
              </label>
              <input
                type="text"
                required
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                placeholder="e.g. 480 mg/l"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500"
              />
            </div>

            {/* Target Standard Dropdown */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Target BIS Standard Reference
              </label>
              <select
                value={standardCode}
                onChange={(e) => setStandardCode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500"
              >
                {DEMO_STANDARDS.map((std) => (
                  <option key={std.id} value={std.code}>
                    {std.code} — {std.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="mt-2 flex items-center gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={isChecking}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-5 py-2.5 text-xs font-medium text-white shadow-xs transition hover:bg-blue-800 disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {isChecking ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Analyzing Standards Matrix...</span>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <span>Check Compliance</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setProductName("");
                  setMaterial("");
                  setSpecName("");
                  setSpecValue("");
                  onToast("Form cleared for new evaluation", "info");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850"
              >
                Reset Fields
              </button>
            </div>
          </form>
        </div>

        {/* Realistic Compliance Result Report Card */}
        {report && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* Report Header */}
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Audit Report #BIS-VAL-2026-09
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Compliance Assessment: {report.productName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Target Standard: <strong className="text-slate-800 dark:text-slate-200">{report.standardCode}</strong>
                </p>
              </div>

              {/* Status Badge */}
              {report.expectedStatus === "compliant" ? (
                <div className="inline-flex items-center gap-1.5 self-start rounded-xl border border-emerald-500/30 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                  <span>✅</span>
                  <span>COMPLIANT</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 self-start rounded-xl border border-amber-500/30 bg-amber-50 px-3.5 py-1.5 text-xs font-bold text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                  <span>⚠️</span>
                  <span>REVIEW REQUIRED</span>
                </div>
              )}
            </div>

            {/* Findings Summary Box */}
            <div className={`mt-4 rounded-xl p-4 text-xs leading-relaxed ${
              report.expectedStatus === "compliant"
                ? "border border-emerald-200/60 bg-emerald-50/50 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200"
                : "border border-amber-200/60 bg-amber-50/50 text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200"
            }`}>
              <div className="font-semibold">Evaluator Finding:</div>
              <p className="mt-1">{report.reportSummary}</p>
            </div>

            {/* Parameters Breakdown Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800">
                    <th className="pb-2 font-semibold">Parameter</th>
                    <th className="pb-2 font-semibold">Observed Value</th>
                    <th className="pb-2 font-semibold">Acceptable Limit</th>
                    <th className="pb-2 font-semibold">Permissible Limit</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  <tr>
                    <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                      {report.details.parameter}
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100">
                      {report.details.observed}
                    </td>
                    <td className="py-3 text-emerald-700 dark:text-emerald-400">
                      {report.details.acceptable}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {report.details.permissible}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                        report.expectedStatus === "compliant"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}>
                        {report.expectedStatus === "compliant" ? "Pass" : "Deficit Flag"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Regulatory Metadata & Clause Reference */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-950/60 dark:text-slate-400">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Governing Clause:
                </span>{" "}
                {report.clauseRef}
              </div>
              <div className="text-[11px] text-slate-400">
                Evaluation Authority: BIS Conformity Assessment Protocol
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                onClick={() =>
                  onToast(
                    `Downloaded official BIS Conformity Certificate PDF for ${report.productName} (Ref: BIS-VAL-2026)`,
                    "success"
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <span>⇩</span>
                <span>Download Compliance Certificate (PDF)</span>
              </button>

              <button
                onClick={() =>
                  onOpenInChat(
                    `Explain the exact clause requirements and test procedure under ${report.standardCode} for ${report.details.parameter}.`
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850"
              >
                <span>💬</span>
                <span>Query AI Assistant for Clause Details</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
