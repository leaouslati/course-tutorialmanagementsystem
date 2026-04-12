import { useState } from "react";

/**
 * Button — reusable button component.
 *
 * Props:
 *  variant    {string}   'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-soft' | 'success' | 'hero'
 *  size       {string}   'sm' | 'md' | 'lg'
 *  darkMode   {boolean}
 *  disabled   {boolean}
 *  loading    {boolean}  shows spinner, disables button
 *  icon       {ReactNode} icon placed before children
 *  iconRight  {ReactNode} icon placed after children
 *  fullWidth  {boolean}  renders w-full
 *  className  {string}   additional Tailwind / utility classes
 *  style      {object}   additional inline styles (merged last, highest specificity)
 *  ...rest    forwarded to the native <button> element
 */
export default function Button({
  variant = "primary",
  size = "md",
  darkMode = false,
  disabled = false,
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  className = "",
  style: styleProp = {},
  children,
  ...rest
}) {
  const [hovered, setHovered] = useState(false);
  const isDisabled = disabled || loading;
  const active = hovered && !isDisabled;

  /* ── size classes ─────────────────────────────────────────────────────── */
  const sizeClass = {
    sm: "text-xs px-3 py-1.5 gap-1 rounded-lg",
    md: "text-sm px-4 py-2.5 gap-1.5 rounded-xl",
    lg: "text-sm px-6 py-3 gap-2 rounded-xl",
  }[size] ?? "text-sm px-4 py-2.5 gap-1.5 rounded-xl";

  /* ── variant inline styles ────────────────────────────────────────────── */
  const getStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: active ? (darkMode ? "#1565C0" : "#2196F3") : "#1976D2",
          color: "#ffffff",
          border: "none",
        };

      case "secondary":
        return {
          backgroundColor: active ? (darkMode ? "#1a3a6b" : "#f1f5f9") : "transparent",
          border: `1px solid ${darkMode ? "#1a3a6b" : "#cbd5e1"}`,
          color: darkMode ? "#94a3b8" : "#475569",
        };

      case "outline":
        return {
          backgroundColor: active ? (darkMode ? "#1e3a5f" : "#e3f0fb") : "transparent",
          border: "1.5px solid #1976D2",
          color: "#1976D2",
        };

      case "ghost":
        return {
          backgroundColor: active
            ? (darkMode ? "#1a3a6b" : "rgba(25,118,210,0.08)")
            : "transparent",
          border: "none",
          color: "#1976D2",
        };

      case "danger":
        return {
          backgroundColor: active ? "#DC2626" : "#EF4444",
          color: "#ffffff",
          border: "none",
        };

      case "danger-soft":
        return {
          backgroundColor: active
            ? (darkMode ? "rgba(239,68,68,0.28)" : "#fee2e2")
            : (darkMode ? "rgba(239,68,68,0.18)" : "#fef2f2"),
          color: darkMode ? "#fca5a5" : "#dc2626",
          border: `1px solid ${active
            ? (darkMode ? "rgba(239,68,68,0.75)" : "#ef4444")
            : (darkMode ? "rgba(239,68,68,0.5)" : "#fca5a5")}`,
        };

      case "success":
        return {
          backgroundColor: active ? "#16a34a" : "#22c55e",
          color: "#ffffff",
          border: "none",
        };

      case "hero":
        return {
          backgroundColor: darkMode ? "#5b9bd5" : "#ffffff",
          color: darkMode ? "#ffffff" : "#1976D2",
          border: "none",
        };

      default:
        return {
          backgroundColor: active ? (darkMode ? "#1565C0" : "#2196F3") : "#1976D2",
          color: "#ffffff",
          border: "none",
        };
    }
  };

  return (
    <button
      className={[
        "inline-flex items-center justify-center font-semibold transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-1",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        sizeClass,
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...getStyle(), ...styleProp }}
      disabled={isDisabled}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
      ) : null}

      {children}

      {!loading && iconRight && (
        <span className="flex-shrink-0" aria-hidden="true">{iconRight}</span>
      )}
    </button>
  );
}
