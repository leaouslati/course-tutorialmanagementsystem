/**
 * StatusBadge — displays a course completion status pill.
 *
 * Props:
 *  progress  {number}  0-100
 *  darkMode  {boolean}
 */
export default function StatusBadge({ progress = 0, darkMode = false }) {
  let label, style;

  if (progress === 100) {
    label = "Completed";
    style = darkMode
      ? { backgroundColor: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid #166534" }
      : { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #86efac" };
  } else if (progress > 0) {
    label = "In Progress";
    style = darkMode
      ? { backgroundColor: "rgba(234,179,8,0.15)", color: "#facc15", border: "1px solid #854d0e" }
      : { backgroundColor: "#fef9c3", color: "#854d0e", border: "1px solid #fde047" };
  } else {
    label = "Not Started";
    style = darkMode
      ? { backgroundColor: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "1px solid #1a3a6b" }
      : { backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" };
  }

  return (
    <span
      className="text-[11px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full whitespace-nowrap font-bold flex-shrink-0"
      style={style}
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}
