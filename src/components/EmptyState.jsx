/**
 * EmptyState — reusable empty/no-results placeholder.
 *
 * Props:
 *  icon      {ReactNode}  icon element (e.g. <BookOpen …/>)
 *  title     {string}
 *  message   {string}
 *  action    {ReactNode}  optional button/link to render below the message
 *  darkMode  {boolean}
 */
export default function EmptyState({ icon, title, message, action, darkMode = false }) {
  const headingCol = darkMode ? "#f1f5f9" : "#111827";
  const bodyText   = darkMode ? "#cbd5e1" : "#4b5563";

  return (
    <div className="flex flex-col items-center justify-center col-span-full py-12 sm:py-16 px-4 text-center">
      {icon && (
        <div className="mb-3 opacity-60" aria-hidden="true">
          {icon}
        </div>
      )}
      <h2 className="text-base sm:text-2xl font-semibold mb-2" style={{ color: headingCol }}>
        {title}
      </h2>
      {message && (
        <p className="text-xs sm:text-base mb-4 max-w-sm mx-auto" style={{ color: bodyText }}>
          {message}
        </p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
