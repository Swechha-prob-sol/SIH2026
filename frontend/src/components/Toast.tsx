import { useEffect } from "react";

export interface ToastMessage {
  id: string;
  text: string;
  type?: "info" | "success" | "warning";
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgStyles =
    toast.type === "success"
      ? "border-emerald-500/50 bg-emerald-950/90 text-emerald-200"
      : toast.type === "warning"
      ? "border-amber-500/50 bg-amber-950/90 text-amber-200"
      : "border-blue-500/50 bg-slate-900/95 text-slate-100";

  const icon =
    toast.type === "success" ? "✓" : toast.type === "warning" ? "⚠️" : "ℹ️";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 dark:border-slate-700">
      <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${bgStyles}`}>
        <span className="text-base">{icon}</span>
        <span className="text-xs font-medium leading-relaxed">{toast.text}</span>
        <button
          onClick={onClose}
          className="ml-2 text-xs opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss toast"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
