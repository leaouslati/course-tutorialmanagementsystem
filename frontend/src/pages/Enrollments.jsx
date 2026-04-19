import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid, Clock, X, AlertTriangle, Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../pages/AuthContext";
import { authFetch } from "../api";
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
        const res = await authFetch("/enrollments"); // FIXED
        if (!res.ok) throw new Error(`Failed to load enrollments (${res.status})`);
        const data = await res.json();
        if (!cancelled) setEnrollments(data);
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
      const res = await authFetch(`/enrollments/${courseId}`, { method: "DELETE" }); // FIXED
      if (!res.ok) throw new Error(`Unenroll failed (${res.status})`);
      setEnrollments((prev) => prev.filter((c) => c.courseId !== courseId));
      setConfirmId(null);
    } catch (err) {
      alert(err.message || "Could not unenroll. Please try again.");
    }
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const bookmarkedCount = enrollments.filter((c) => isBookmarked(c.courseId)).length;
  const visibleCourses  = bookmarkFilter === "bookmarked"
    ? enrollments.filter((c) => isBookmarked(c.courseId))
    : enrollments;
  const confirmCourse = enrollments.find((c) => c.courseId === confirmId);

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
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <h3 id="unenroll-title" className="text-sm sm:text-base font-bold truncate"
                  style={{ color: headingCol }}>
                  Unenroll from course?
                </h3>
              </div>

              <button onClick={() => setConfirmId(null)} aria-label="Cancel"
                className="rounded-lg p-1.5 transition flex-shrink-0"
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
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#1976D2" }} />
            <p style={{ color: mutedCol }}>Loading your courses…</p>
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        {/* ── Content ── */}
        {!loading && !error && (
          <>
            {enrollments.length === 0 ? (
              <div className="text-center">
                <h2 style={{ color: headingCol }}>No Enrollments Yet</h2>
                <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
              </div>
            ) : (
              <ol>
                {visibleCourses.map((course) => {
                  const progress = course.progress ?? 0;
                  const actionLabel =
                    progress === 100 ? "Review" :
                    progress > 0 ? "Continue" : "Start";

                  return (
                    <li key={course.courseId}>
                      <h2>{course.title}</h2>

                      <ProgressBar value={progress} courseId={course.courseId} darkMode={darkMode} />
                      <StatusBadge progress={progress} darkMode={darkMode} />

                      <Link to={`/courses/${course.courseId}`}>
                        {actionLabel}
                      </Link>

                      <button onClick={() => setConfirmId(course.courseId)}>
                        Unenroll
                      </button>
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