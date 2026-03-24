import { Link, useNavigate } from "react-router-dom";
import { courses, users, modules } from "../data/mockdata.js";
import { LayoutGrid, Clock, X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../pages/AuthContext";

function Enrollments({ darkMode = false }) {
  const { currentUser } = useAuth();

  const [enrolled,  setEnrolled]  = useState(
    Array.isArray(currentUser?.enrolledCourses) ? currentUser.enrolledCourses : []
  );
  const [confirmId, setConfirmId] = useState(null);
  const navigate = useNavigate();

  const enrolledCourses = courses.filter((c) => enrolled.includes(c.id));

  const handleUnenroll = (courseId) => {
    const updated = enrolled.filter((id) => id !== courseId);
    setEnrolled(updated);
    currentUser.enrolledCourses = updated;
    setConfirmId(null);
  };

  const getInstructorName = (id) =>
    users.find((u) => u.id === id)?.name || "Unknown Instructor";

  const countLessons = (course) => {
    if (!Array.isArray(course.modules)) return 0;
    return modules
      .filter((m) => course.modules.includes(m.id))
      .reduce((total, m) => total + (Array.isArray(m.lessons) ? m.lessons.length : 0), 0);
  };

  const computeProgress = (course) => currentUser?.progress?.[course.id] ?? 0;

  const getStatus = (progress) => {
    if (progress === 100) return {
      label: "Completed",
      style: darkMode
        ? { backgroundColor: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid #166534" }
        : { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #86efac" },
    };
    if (progress > 0) return {
      label: "In Progress",
      style: darkMode
        ? { backgroundColor: "rgba(234,179,8,0.15)", color: "#facc15", border: "1px solid #854d0e" }
        : { backgroundColor: "#fef9c3", color: "#854d0e", border: "1px solid #fde047" },
    };
    return {
      label: "Not Started",
      style: darkMode
        ? { backgroundColor: "rgba(148,163,184,0.1)", color: "#94a3b8", border: "1px solid #1a3a6b" }
        : { backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" },
    };
  };

  const confirmCourse = courses.find((c) => c.id === confirmId);

  const pageBg      = darkMode ? "#060f1e" : "#F4F8FD";
  const cardBg      = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder  = darkMode ? "#1a3a6b" : "transparent";
  const headingCol  = darkMode ? "#f1f5f9" : "#111827";
  const subCol      = darkMode ? "#94a3b8" : "#4b5563";
  const mutedCol    = darkMode ? "#64748b" : "#94a3b8";
  const bodyText    = darkMode ? "#cbd5e1" : "#4b5563";
  const labelText   = darkMode ? "#94a3b8" : "#374151";
  const dividerCol  = darkMode ? "#1a3a6b" : "#f1f5f9";
  const progressBg  = darkMode ? "#1a3a6b" : "#e5e7eb";
  const modalBg     = darkMode ? "#0f1f3d" : "#ffffff";
  const modalBorder = darkMode ? "#1a3a6b" : "#f1f5f9";

  return (
    <div
      className="min-h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: pageBg }}
    >

      {/* ── Unenroll Confirm Modal ── */}
      {confirmId && confirmCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unenroll-title"
        >
          <div
            className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: modalBg, border: `1px solid ${modalBorder}` }}
          >
            <div
              className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: modalBorder }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" aria-hidden="true" />
                <h3
                  id="unenroll-title"
                  className="text-sm sm:text-base font-bold truncate"
                  style={{ color: headingCol }}
                >
                  Unenroll from course?
                </h3>
              </div>
              <button
                onClick={() => setConfirmId(null)}
                aria-label="Cancel"
                className="rounded-lg p-1.5 transition flex-shrink-0"
                style={{ color: mutedCol }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f1f5f9")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="px-5 py-5">
              <p className="text-sm leading-relaxed" style={{ color: bodyText }}>
                Are you sure you want to unenroll from{" "}
                <span className="font-semibold" style={{ color: headingCol }}>
                  {confirmCourse.title}
                </span>
                ? Your progress will be lost.
              </p>
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${darkMode ? "#1a3a6b" : "#cbd5e1"}`,
                  color: darkMode ? "#94a3b8" : "#475569",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f1f5f9")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnenroll(confirmId)}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition"
                style={{ backgroundColor: "#EF4444" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#DC2626")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#EF4444")}
              >
                Yes, unenroll
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Header ── */}
        <header className="mb-6 sm:mb-8">
          <h1
            className="font-bold mb-2"
            style={{ fontSize: "clamp(1.6rem, 5vw, 2.25rem)", color: headingCol }}
          >
            My Enrollments
          </h1>
          <p className="text-base sm:text-lg font-semibold mb-1" style={{ color: subCol }}>
            Continue your courses and keep up with your progress.
          </p>
          <p className="text-sm" style={{ color: mutedCol }} aria-live="polite">
            {enrolledCourses.length}{" "}
            {enrolledCourses.length === 1 ? "course" : "courses"} enrolled
          </p>
        </header>

        {/* ── Empty state ── */}
        {enrolledCourses.length === 0 ? (
          <div
            className="rounded-xl p-6 sm:p-8 text-center shadow-sm"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <h2 className="text-lg sm:text-2xl font-semibold mb-3" style={{ color: headingCol }}>
              No Enrollments Yet
            </h2>
            <p className="mb-5 max-w-md mx-auto text-sm sm:text-base" style={{ color: bodyText }}>
              You are not enrolled in any courses yet. Start exploring courses and begin learning.
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="rounded-xl py-2.5 px-6 text-sm font-semibold text-white shadow transition"
              style={{ backgroundColor: "#1976D2" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
            >
              Browse Courses
            </button>
          </div>

        ) : (
          <ol
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            aria-label="Enrolled courses"
          >
            {enrolledCourses.map((course) => {
              const progress    = computeProgress(course);
              const lessons     = countLessons(course);
              const status      = getStatus(progress);
              const remaining   = Math.round(course.duration * (1 - progress / 100));
              const barColor    = progress === 100 ? "#22C55E" : "#1976D2";
              const actionLabel = progress === 100 ? "Review" : progress > 0 ? "Continue" : "Start";
              const moduleCount = Array.isArray(course.modules) ? course.modules.length : 0;

              return (
                <li
                  key={course.id}
                  className="rounded-xl hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 flex flex-col gap-3 list-none"
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    boxShadow: darkMode
                      ? "none"
                      : "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = darkMode
                      ? "0 0 24px 2px rgba(25,118,210,0.15)"
                      : "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = darkMode
                      ? "none"
                      : "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)";
                  }}
                >
                  {/* ── Title + status badge ── */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h2
                        className="text-base sm:text-lg font-bold mb-0.5 leading-snug"
                        style={{ color: headingCol }}
                      >
                        {course.title}
                      </h2>
                      <p className="text-xs sm:text-sm font-medium truncate" style={{ color: subCol }}>
                        {getInstructorName(course.instructorId)}
                      </p>
                    </div>
                    <span
                      className="text-[11px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full whitespace-nowrap font-bold flex-shrink-0 mt-0.5"
                      style={status.style}
                      aria-label={`Status: ${status.label}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* ── Category ── */}
                  <p className="text-xs sm:text-sm" style={{ color: bodyText }}>
                    <span className="font-medium" style={{ color: labelText }}>Category:</span>{" "}
                    {course.category || "General"}
                  </p>

                  {/* ── Modules + lessons ── */}
                  <div className="flex items-start gap-2 text-xs sm:text-sm" style={{ color: bodyText }}>
                    <LayoutGrid
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5"
                      style={{ color: "#1976D2" }}
                      aria-hidden="true"
                    />
                    <span className="leading-snug">
                      {moduleCount} {moduleCount === 1 ? "module" : "modules"}{" "}
                      · {lessons} {lessons === 1 ? "lesson" : "lessons"}
                    </span>
                  </div>

                  {/* ── Time remaining ── */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: bodyText }}>
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-[#22C55E]" aria-hidden="true" />
                    <span>{remaining} min left</span>
                  </div>

                  {/* ── Progress bar ── */}
                  <div>
                    <div
                      className="flex items-center justify-between text-xs sm:text-sm mb-1.5"
                      style={{ color: bodyText }}
                    >
                      <span id={`progress-label-${course.id}`}>Progress</span>
                      <span className="font-semibold" style={{ color: barColor }}>
                        {progress}%
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-labelledby={`progress-label-${course.id}`}
                      className="h-2 sm:h-2.5 w-full rounded-full overflow-hidden"
                      style={{ backgroundColor: progressBg }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${progress}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </div>

                  {/* ── Actions ── */}
                  <div
                    className="flex items-center justify-between gap-2 pt-2 border-t"
                    style={{ borderColor: dividerCol }}
                  >
                    <Link
                      to={`/courses/${course.id}`}
                      aria-label={`${actionLabel} ${course.title}`}
                      className="text-xs sm:text-sm font-semibold text-[#1976D2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2 rounded"
                      onMouseEnter={(e) => (e.currentTarget.style.color = darkMode ? "#60a5fa" : "#2196F3")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#1976D2")}
                    >
                      {actionLabel} →
                    </Link>
                    <button
                      onClick={() => setConfirmId(course.id)}
                      aria-label={`Unenroll from ${course.title}`}
                      className="text-xs sm:text-sm font-semibold transition-colors"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#EF4444" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#DC2626")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#EF4444")}
                    >
                      Unenroll
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </main>
    </div>
  );
}

export default Enrollments;