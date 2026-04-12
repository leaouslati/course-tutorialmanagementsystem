import { Link, useNavigate } from "react-router-dom";
import { courses, users, modules } from "../data/mockdata.js";
import { LayoutGrid, Clock, X, AlertTriangle, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../pages/AuthContext";
import ProgressBar from "../components/ProgressBar";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";

function Enrollments({ darkMode = false }) {
  const { currentUser, toggleBookmark, isBookmarked } = useAuth();

  const [enrolled, setEnrolled] = useState(
    Array.isArray(currentUser?.enrolledCourses) ? currentUser.enrolledCourses : []
  );
  const [confirmId, setConfirmId] = useState(null);
  // "all" | "bookmarked"
  const [bookmarkFilter, setBookmarkFilter] = useState("all");
  const navigate = useNavigate();

  const enrolledCourses = courses.filter((c) => enrolled.includes(c.id));

  // Apply bookmark filter
  const visibleCourses =
    bookmarkFilter === "bookmarked"
      ? enrolledCourses.filter((c) => isBookmarked(c.id))
      : enrolledCourses;

  const bookmarkedCount = enrolledCourses.filter((c) => isBookmarked(c.id)).length;

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

  // Status and progress are now handled by <StatusBadge> and <ProgressBar> components.

  const confirmCourse = courses.find((c) => c.id === confirmId);

  const pageBg = darkMode ? "#060f1e" : "#F4F8FD";
  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder = darkMode ? "#1a3a6b" : "transparent";
  const headingCol = darkMode ? "#f1f5f9" : "#111827";
  const subCol = darkMode ? "#94a3b8" : "#4b5563";
  const mutedCol = darkMode ? "#64748b" : "#94a3b8";
  const bodyText = darkMode ? "#cbd5e1" : "#4b5563";
  const labelText = darkMode ? "#94a3b8" : "#374151";
  const dividerCol = darkMode ? "#1a3a6b" : "#f1f5f9";
  const modalBg = darkMode ? "#0f1f3d" : "#ffffff";
  const modalBorder = darkMode ? "#1a3a6b" : "#f1f5f9";
  const filterBase = {
    backgroundColor: darkMode ? "#0f1f3d" : "#ffffff",
    color: darkMode ? "#94a3b8" : "#4b5563",
    border: `1px solid ${darkMode ? "#1a3a6b" : "#e5e7eb"}`,
    boxShadow: darkMode ? "none" : "0 1px 4px rgba(0,0,0,0.06)",
  };
  const filterActive = {
    backgroundColor: "#1976D2",
    color: "#ffffff",
    border: "1px solid #1976D2",
    boxShadow: "none",
  };

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
              <Button variant="secondary" size="md" darkMode={darkMode} onClick={() => setConfirmId(null)} className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" size="md" darkMode={darkMode} onClick={() => handleUnenroll(confirmId)} className="flex-1">
                Yes, unenroll
              </Button>
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
            {bookmarkedCount > 0 && (
              <span> · {bookmarkedCount} bookmarked</span>
            )}
          </p>
        </header>

        {/* ── Bookmark filter tabs — only shown when enrolled in ≥1 course ── */}
        {enrolledCourses.length > 0 && (
          <div className="flex items-center gap-2 mb-5 sm:mb-6" role="group" aria-label="Filter enrolled courses">
            {[
              { value: "all", label: "All enrolled" },
              { value: "bookmarked", label: `Bookmarked (${bookmarkedCount})` },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setBookmarkFilter(value)}
                aria-pressed={bookmarkFilter === value}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"
                style={bookmarkFilter === value ? filterActive : filterBase}
                onMouseEnter={(e) => {
                  if (bookmarkFilter !== value)
                    e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  if (bookmarkFilter !== value)
                    e.currentTarget.style.backgroundColor = filterBase.backgroundColor;
                }}
              >
                {value === "bookmarked" && (
                  <Bookmark size={13} aria-hidden="true" />
                )}
                {label}
              </button>
            ))}
          </div>
        )}

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
            <Button variant="primary" size="md" darkMode={darkMode} onClick={() => navigate("/courses")} className="shadow">
              Browse Courses
            </Button>
          </div>

        ) : visibleCourses.length === 0 ? (
          /* Empty state when bookmark filter has no results */
          <div
            className="rounded-xl p-6 sm:p-8 text-center shadow-sm"
            style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <Bookmark className="mx-auto mb-3 w-8 h-8 opacity-40" style={{ color: mutedCol }} aria-hidden="true" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: headingCol }}>
              No bookmarked courses
            </h2>
            <p className="mb-4 max-w-sm mx-auto text-sm" style={{ color: bodyText }}>
              Open any enrolled course and tap the bookmark icon to save it here.
            </p>
            <Button variant="primary" size="md" darkMode={darkMode} onClick={() => setBookmarkFilter("all")} className="shadow">
              Show all enrolled
            </Button>
          </div>

        ) : (
          <ol
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            aria-label="Enrolled courses"
          >
            {visibleCourses.map((course) => {
              const progress = computeProgress(course);
              const lessons = countLessons(course);
              const remaining = Math.round(course.duration * (1 - progress / 100));
              const actionLabel = progress === 100 ? "Review" : progress > 0 ? "Continue" : "Start";
              const moduleCount = Array.isArray(course.modules) ? course.modules.length : 0;
              const bookmarked = isBookmarked(course.id);

              return (
                <li
                  key={course.id}
                  className="rounded-xl hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 flex flex-col gap-3 list-none"
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${bookmarked ? (darkMode ? "#1e4d91" : "#bfdbfe") : cardBorder}`,
                    boxShadow: darkMode
                      ? bookmarked ? "0 0 0 1px rgba(25,118,210,0.25)" : "none"
                      : "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = darkMode
                      ? "0 0 24px 2px rgba(25,118,210,0.15)"
                      : "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = darkMode
                      ? bookmarked ? "0 0 0 1px rgba(25,118,210,0.25)" : "none"
                      : "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)";
                  }}
                >
                  {/* ── Title + status badge + bookmark icon ── */}
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

                    <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                      {/* Bookmark toggle */}
                      <button
                        onClick={() => toggleBookmark(course.id)}
                        aria-label={bookmarked ? `Remove bookmark from ${course.title}` : `Bookmark ${course.title}`}
                        aria-pressed={bookmarked}
                        className="p-1.5 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: bookmarked ? "#1976D2" : mutedCol,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#1976D2")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = bookmarked ? "#1976D2" : mutedCol)}
                        title={bookmarked ? "Remove bookmark" : "Bookmark"}
                      >
                        {bookmarked
                          ? <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                          : <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />}
                      </button>

                      {/* Status badge — reusable component */}
                      <StatusBadge progress={progress} darkMode={darkMode} />
                    </div>
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

                  {/* ── Progress bar — reusable component ── */}
                  <ProgressBar value={progress} courseId={course.id} darkMode={darkMode} />

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
