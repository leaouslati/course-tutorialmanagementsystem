/**
 * ProgressBar — reusable course-progress bar.
 *
 * Props:
 *  value      {number}  0-100 percentage
 *  courseId   {string}  used for accessible aria-labelledby pairing
 *  darkMode   {boolean}
 *  showLabel  {boolean} show "Progress" label + percentage text (default true)
 */
export default function ProgressBar({ value = 0, courseId = "", darkMode = false, showLabel = true }) {
  const pct = Math.min(100, Math.max(0, value));
  const barColor = pct === 100 ? "#22C55E" : "#1976D2";
  const progressBg = darkMode ? "#1a3a6b" : "#e5e7eb";
  const bodyText = darkMode ? "#cbd5e1" : "#4b5563";
  const labelId = `progress-label-${courseId}`;

  return (
    <div>
      {showLabel && (
        <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5" style={{ color: bodyText }}>
          <span id={labelId}>Progress</span>
          <span className="font-semibold" style={{ color: barColor }}>{pct}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby={showLabel ? labelId : undefined}
        aria-label={showLabel ? undefined : `${pct}% complete`}
        className="h-2 sm:h-2.5 w-full rounded-full overflow-hidden"
        style={{ backgroundColor: progressBg }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
