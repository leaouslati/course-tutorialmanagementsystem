import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid, Clock, X, AlertTriangle, Bookmark, BookmarkCheck } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useState, useEffect } from "react";
import { useAuth } from "../pages/AuthContext";
import { authFetch, API_URL } from "../api";
import ProgressBar from "../components/ProgressBar";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";

function Enrollments({ darkMode = false }) {
  const { toggleBookmark, isBookmarked } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [bookmarkFilter, setBookmarkFilter] = useState("all"); // "all" | "bookmarked"

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchEnrollments = async () => {
      try {
        const res = await authFetch(`${API_URL}/enrollments`);
        if (!res.ok) throw new Error(`Failed to load enrollments (${res.status})`);
        const data = await res.json();
        if (!cancelled) setEnrollments(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchEnrollments();
    return () => { cancelled = true; };
  }, []);

  // ── Unenroll ────────────────────────────────────────────────────────────────
  const handleUnenroll = async (courseId) => {
    try {
      const res = await authFetch(`${API_URL}/enrollments/${courseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Unenroll failed (${res.status})`);
      setEnrollments((prev) => prev.filter((c) => c.id !== courseId));
      setConfirmId(null);
    } catch (err) {
      alert(err.message || "Could not unenroll. Please try again.");
    }
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const bookmarkedCount = enrollments.filter((c) => isBookmarked(c.id)).length;
  const visibleCourses  = bookmarkFilter === "bookmarked"
    ? enrollments.filter((c) => isBookmarked(c.id))
    : enrollments;
  const confirmCourse = enrollments.find((c) => c.id === confirmId);

  // ── Theme tokens ────────────────────────────────────────────────────────────
  const pageBg      = darkMode ? "#060f1e" : "#F4F8FD";
  const cardBg      = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder  = darkMode ? "#1a3a6b" : "transparent";
  const headingCol  = darkMode ? "#f1f5f9" : "#111827";
  const subCol      = darkMode ? "#94a3b8" : "#4b5563";
  const mutedCol    = darkMode ? "#64748b" : "#94a3b8";
  const bodyText    = darkMode ? "#cbd5e1" : "#4b5563";
  const labelText   = darkMode ? "#94a3b8" : "#374151";
  const dividerCol  = darkMode ? "#1a3a6b" : "#f1f5f9";
  const modalBg     = darkMode ? "#0f1f3d" : "#ffffff";
  const modalBorder = darkMode ? "#1a3a6b" : "#f1f5f9";

  const filterBase  = {
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
    <div className="min-h-screen w-full transition-colors duration-300" style={{ backgroundColor: pageBg }}>

      {/* ── Unenroll Confirm Modal ── */}
      {confirmId && confirmCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          role="dialog" aria-modal="true" aria-labelledby="unenroll-title">

          <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: modalBg, border: `1px solid ${modalBorder}` }}>

            <div className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: modalBorder }}>

              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <h3 id="unenroll-title" className="text-sm sm:text-base font-bold truncate"
                  style={{ color: headingCol }}>
                  Unenroll from course?
                </h3>
              </div>

              <button onClick={() => setConfirmId(null)} aria-label="Cancel"
                className="rounded-lg p-1.5 transition shrink-0"
                style={{ color: mutedCol }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-5">
              <p className="text-sm" style={{ color: bodyText }}>
                Are you sure you want to unenroll from{" "}
                <span className="font-semibold" style={{ color: headingCol }}>
                  {confirmCourse.title}
                </span>?
              </p>
            </div>

            <div className="flex gap-3 px-5 pb-5">
              <Button variant="secondary" darkMode={darkMode} onClick={() => setConfirmId(null)} className="flex-1">
                Cancel
              </Button>
              <Button variant="danger" darkMode={darkMode} onClick={() => handleUnenroll(confirmId)} className="flex-1">
                Yes, unenroll
              </Button>
            </div>

          </div>
        </div>
      )}

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Header ── */}
        <header className="mb-6 sm:mb-8">
          <h1 className="font-bold mb-2" style={{ fontSize: "clamp(1.6rem, 5vw, 2.25rem)", color: headingCol }}>
            My Enrollments
          </h1>
          <p style={{ color: subCol }}>
            Continue your courses and keep up with your progress.
          </p>
        </header>

        {/* ── Loading ── */}
        {loading && <LoadingSpinner darkMode={darkMode} message="Loading your courses…" />}

        {/* ── Error ── */}
        {!loading && error && <ErrorMessage message={error} darkMode={darkMode} />}

        {/* ── Content ── */}
        {!loading && !error && (
          <>
            {/* ── Bookmark filter tabs ── */}
            {enrollments.length > 0 && (
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
                    {value === "bookmarked" && <Bookmark size={13} aria-hidden="true" />}
                    {label}
                  </button>
                ))}
              </div>
            )}

            {enrollments.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    <Bookmark className="w-10 h-10 opacity-40" style={{ color: mutedCol }} />

    <h2 className="text-lg font-semibold" style={{ color: headingCol }}>
      No enrollments yet
    </h2>

    <p className="text-sm" style={{ color: subCol }}>
      You haven’t enrolled in any courses yet. Start learning now!
    </p>

    <Button
      variant="primary"
      size="md"
      darkMode={darkMode}
      onClick={() => navigate("/courses")}
    >
      Browse Courses
    </Button>
  </div>

) : visibleCourses.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
    <Bookmark className="w-10 h-10 opacity-40" style={{ color: mutedCol }} />

    <h2 className="text-lg font-semibold" style={{ color: headingCol }}>
      No bookmarked courses
    </h2>

    <p className="text-sm" style={{ color: subCol }}>
      You haven’t bookmarked any courses yet.
    </p>

    <Button
      variant="primary"
      size="md"
      darkMode={darkMode}
      onClick={() => setBookmarkFilter("all")}
    >
      Show all enrolled
    </Button>
  </div>

) : (
              <ol className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" aria-label="Enrolled courses">
                {visibleCourses.map((course) => {
                  const progress = Math.min(100, Math.max(0, Number(course.progress ?? 0)));
                  const actionLabel =
                    progress >= 100 ? "Review" :
                    progress > 0   ? "Continue" : "Start";
                  const bookmarked = isBookmarked(course.id);
                  const moduleCount = Array.isArray(course.modules) ? course.modules.length : 0;
                  const remaining = Math.round((course.duration || 0) * (1 - progress / 100));

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
                      {/* ── Title + status badge + bookmark ── */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-base sm:text-lg font-bold mb-0.5 leading-snug" style={{ color: headingCol }}>
                            {course.title}
                          </h2>
                          {course.instructorName && (
                            <p className="text-xs sm:text-sm font-medium truncate" style={{ color: subCol }}>
                              {course.instructorName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          <button
                            onClick={() => toggleBookmark(course.id)}
                            aria-label={bookmarked ? `Remove bookmark from ${course.title}` : `Bookmark ${course.title}`}
                            aria-pressed={bookmarked}
                            className="p-1.5 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"
                            style={{ background: "none", border: "none", cursor: "pointer", color: bookmarked ? "#1976D2" : mutedCol }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#1976D2")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = bookmarked ? "#1976D2" : mutedCol)}
                          >
                            {bookmarked
                              ? <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                              : <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />}
                          </button>
                          <StatusBadge progress={progress} darkMode={darkMode} />
                        </div>
                      </div>

                      {/* ── Category ── */}
                      {course.category && (
                        <p className="text-xs sm:text-sm" style={{ color: bodyText }}>
                          <span className="font-medium" style={{ color: labelText }}>Category:</span>{" "}
                          {course.category}
                        </p>
                      )}

                      {/* ── Modules ── */}
                      {moduleCount > 0 && (
                        <div className="flex items-start gap-2 text-xs sm:text-sm" style={{ color: bodyText }}>
                          <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" style={{ color: "#1976D2" }} aria-hidden="true" />
                          <span>{moduleCount} {moduleCount === 1 ? "module" : "modules"}</span>
                        </div>
                      )}

                      {/* ── Time remaining ── */}
                      {course.duration > 0 && (
                        <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: bodyText }}>
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-[#22C55E]" aria-hidden="true" />
                          <span>{remaining} min left</span>
                        </div>
                      )}

                      {/* ── Progress bar ── */}
                      <ProgressBar value={progress} courseId={course.id} darkMode={darkMode} />

                      {/* ── Actions ── */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: dividerCol }}>
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
          </>
        )}

      </main>
    </div>
  );
}

export default Enrollments;
