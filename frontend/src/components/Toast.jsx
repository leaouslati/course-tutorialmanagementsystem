import { useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function Toast({ message, type = "success", onClose, darkMode = false }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  const isError = type === "error";

  return (
    <div aria-live="polite" aria-atomic="true" className="fixed top-4 right-4 z-50 pointer-events-none">
      <div
        className="pointer-events-auto flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium shadow-lg"
        style={
          isError
            ? {
                backgroundColor: darkMode ? "rgba(239,68,68,0.15)" : "#fef2f2",
                border: `1px solid ${darkMode ? "#7f1d1d" : "#fca5a5"}`,
                color: darkMode ? "#f87171" : "#b91c1c",
              }
            : {
                backgroundColor: darkMode ? "rgba(34,197,94,0.15)" : "#f0fdf4",
                border: `1px solid ${darkMode ? "#166534" : "#86efac"}`,
                color: darkMode ? "#4ade80" : "#15803d",
              }
        }
      >
        {isError ? (
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        {message}
      </div>
    </div>
  );
}
