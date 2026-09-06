import { DEMO_CERTIFICATION_SCHEMES, type CertificationScheme } from "../data/demoData";

interface CertificationSchemesProps {
  onOpenInChat: (query: string) => void;
  onToast: (msg: string, type?: "info" | "success" | "warning") => void;
}

export default function CertificationSchemes({
  onOpenInChat,
  onToast,
}: CertificationSchemesProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f5f7fa] px-4 py-6 transition-colors duration-150 sm:px-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-900 text-xs font-bold text-white dark:bg-blue-600">
                ★
              </span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                BIS Certification & Conformity Schemes
              </h1>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Official regulatory conformity assessment frameworks administered by the Bureau of Indian Standards
            </p>
          </div>

          <button
            onClick={() =>
              onToast(
                "BIS Portal Connectivity Verified — License Application Guidelines Active (2026)",
                "success"
              )
            }
            className="self-start rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850"
          >
            Manakonline Portal Status: Online
          </button>
        </div>

        {/* Schemes Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {DEMO_CERTIFICATION_SCHEMES.map((scheme: CertificationScheme) => {
            return (
              <div
                key={scheme.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700"
              >
                <div>
                  {/* Category Pill & Code */}
                  <div className="flex flex-col gap-1.5">
                    <span className="self-start rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-900 dark:bg-blue-950/80 dark:text-blue-300">
                      {scheme.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {scheme.name}
                    </h3>
                  </div>

                  {/* Badge */}
                  <div className="mt-2.5 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                    🛡 {scheme.badge}
                  </div>

                  {/* Description (2-3 sentences) */}
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {scheme.description}
                  </p>

                  {/* Key Regulated Products */}
                  <div className="mt-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Regulated Products:
                    </span>
                    <ul className="mt-2 space-y-1">
                      {scheme.keyProducts.map((prod, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <span className="text-blue-900 dark:text-blue-400 text-[10px]">
                            ▸
                          </span>
                          <span>{prod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <button
                    onClick={() => onOpenInChat(scheme.suggestedPrompt)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-2 text-xs font-medium text-white shadow-xs transition hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    <span>💬</span>
                    <span>Learn More in AI Chat</span>
                  </button>

                  <button
                    onClick={() =>
                      onToast(
                        `Downloaded official ${scheme.name} guidelines manual (PDF)`,
                        "success"
                      )
                    }
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850"
                  >
                    <span>⇩</span>
                    <span>Download Scheme Manual</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Educational Banner */}
        <div className="rounded-2xl border border-blue-200/60 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 p-5 dark:border-blue-900/40 dark:from-blue-950/20 dark:to-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                BIS Compliance Knowledge Note
              </h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Manufacturing, importing, or distributing products covered under Quality Control Orders (QCOs) without valid BIS certification attracts penal provisions under Section 29 of the BIS Act, 2016.
              </p>
            </div>

            <button
              onClick={() =>
                onOpenInChat(
                  "What are the mandatory legal penalties and seizure rules under Section 29 of the BIS Act 2016 for selling non-certified goods?"
                )
              }
              className="shrink-0 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-blue-900 shadow-xs transition hover:bg-slate-50 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-750"
            >
              Ask AI About QCO Penalties →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
