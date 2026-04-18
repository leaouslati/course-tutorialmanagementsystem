import React, { useState, useEffect, useCallback } from "react";
import CourseCard from "../components/CourseCard";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { Search, RotateCcw, BookOpen, X, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";
import { API_URL, authFetch } from "../api";

function Courses({ darkMode = false }) {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sortRating, setSortRating] = useState("");
  const [sortTime, setSortTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync category from URL params on mount
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  // Fetch courses whenever filters change
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category)   params.set("category",   category);
      if (difficulty) params.set("difficulty",  difficulty);
      if (search)     params.set("search",      search);
      if (sortRating) params.set("sortRating",  sortRating);
      if (sortTime)   params.set("sortTime",    sortTime);

      const url = `${API_URL}/courses${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await authFetch(url);

      if (!res.ok) {
        throw new Error(`Failed to load courses (${res.status})`);
      }

      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [category, difficulty, search, sortRating, sortTime]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const resetAll = () => {
    setSearch("");
    setSortRating("");
    setSortTime("");
    setDifficulty("");
    setCategory("");
  };

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const pageBg          = darkMode ? "#060f1e" : "#F4F8FD";
  const cardBg          = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder      = darkMode ? "#1a3a6b" : "transparent";
  const headingCol      = darkMode ? "#f1f5f9" : "#111827";
  const subCol          = darkMode ? "#94a3b8" : "#4b5563";
  const inputText       = darkMode ? "#f1f5f9" : "#1f2937";
  const inputPlaceholder= darkMode ? "#64748b" : "#9ca3af";
  const countText       = darkMode ? "#94a3b8" : "#4b5563";

  const btnBase = {
    backgroundColor: cardBg,
    color: darkMode ? "#94a3b8" : "#424242",
    border: `1px solid ${darkMode ? "#1a3a6b" : "transparent"}`,
    boxShadow: darkMode ? "none" : "0 2px 8px 0 rgba(0,0,0,0.08)",
  };
  const btnActive = {
    backgroundColor: "#1976D2",
    color: "#ffffff",
    border: "1px solid #1976D2",
    boxShadow: "none",
  };

  const filterBtnClass =
    "px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg transition-all duration-150 whitespace-nowrap";

  // ── Render ─────────────────────────────────────────────────────────────────
  const renderContent = () => {
    if (loading) {
      return (
        <div
          className="col-span-full flex flex-col items-center justify-center py-20 gap-4"
          role="status"
          aria-label="Loading courses"
        >
          <Loader2
            className="animate-spin"
            size={40}
            style={{ color: "#1976D2" }}
            aria-hidden="true"
          />
          <p className="text-sm font-medium" style={{ color: subCol }}>
            Loading courses…
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
          <AlertCircle size={40} style={{ color: "#ef4444" }} aria-hidden="true" />
          <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>
            {error}
          </p>
          <Button variant="primary" size="md" darkMode={darkMode} onClick={fetchCourses}>
            Try Again
          </Button>
        </div>
      );
    }

    if (courses.length === 0) {
      const hasActiveFilters = search || difficulty || category;
      return (
        <EmptyState
          darkMode={darkMode}
          icon={
            hasActiveFilters
              ? <Search className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: "#60a5fa" }} />
              : <BookOpen className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: "#60a5fa" }} />
          }
          title={hasActiveFilters ? "No courses found" : "No courses available"}
          message={
            hasActiveFilters
              ? "Try adjusting your search or filters to discover more courses."
              : "There are currently no courses in the system. Please check back later or contact an instructor."
          }
          action={
            hasActiveFilters ? (
              <Button variant="primary" size="md" darkMode={darkMode} onClick={resetAll} className="shadow">
                Reset Filters
              </Button>
            ) : undefined
          }
        />
      );
    }

    return courses.map((course) => (
      <CourseCard key={course.id} course={course} darkMode={darkMode} />
    ));
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: pageBg }}
    >
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-8 sm:pb-12">

        {/* ── Header ── */}
        <header className="mb-4 sm:mb-6">
          <h1
            className="font-bold text-left mb-2"
            style={{ fontSize: "clamp(2.35rem, 4vw, 3rem)", color: headingCol }}
          >
            Available Courses
          </h1>
          <p
            className="font-semibold text-left"
            style={{ fontSize: "clamp(0.8rem, 2.5vw, 1.25rem)", color: subCol }}
          >
            Learn. Grow. Achieve.
          </p>
        </header>

        {/* ── Filters ── */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-5 sm:mb-6">

          {/* Search */}
          <div className="relative w-full">
            <Search
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: inputPlaceholder }}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search courses"
              className="w-full pl-10 sm:pl-12 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base outline-none transition-colors duration-300"
              style={{
                backgroundColor: cardBg,
                color: inputText,
                border: `1px solid ${darkMode ? "#1a3a6b" : "transparent"}`,
                boxShadow: darkMode ? "none" : "0 2px 8px 0 rgba(0,0,0,0.08)",
              }}
            />
          </div>

          {/* Filter buttons row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">

            {/* Difficulty filters */}
            <div className="flex flex-wrap gap-2">
              {["", "Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`${filterBtnClass} w-full sm:w-auto`}
                  style={difficulty === level ? btnActive : btnBase}
                  aria-pressed={difficulty === level}
                  onMouseEnter={(e) => {
                    if (difficulty !== level)
                      e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    if (difficulty !== level)
                      e.currentTarget.style.backgroundColor = cardBg;
                  }}
                >
                  {level === "" ? "All Levels" : level}
                </button>
              ))}
            </div>

            {/* Sort + reset */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSortRating(sortRating === "desc" ? "asc" : "desc")}
                className={filterBtnClass}
                style={{ ...(sortRating ? btnActive : btnBase), width: "100px", flexShrink: 0 }}
                aria-label={`Sort by rating ${sortRating === "asc" ? "descending" : "ascending"}`}
                onMouseEnter={(e) => {
                  if (!sortRating)
                    e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  if (!sortRating)
                    e.currentTarget.style.backgroundColor = cardBg;
                }}
              >
                <span className="flex items-center justify-center gap-1">
                  Rating {sortRating === "asc" ? "↑" : sortRating === "desc" ? "↓" : ""}
                </span>
              </button>

              <button
                onClick={() => setSortTime(sortTime === "desc" ? "asc" : "desc")}
                className={filterBtnClass}
                style={{ ...(sortTime ? btnActive : btnBase), width: "110px", flexShrink: 0 }}
                aria-label={`Sort by duration ${sortTime === "asc" ? "descending" : "ascending"}`}
                onMouseEnter={(e) => {
                  if (!sortTime)
                    e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  if (!sortTime)
                    e.currentTarget.style.backgroundColor = cardBg;
                }}
              >
                <span className="flex items-center justify-center gap-1">
                  Duration {sortTime === "asc" ? "↑" : sortTime === "desc" ? "↓" : ""}
                </span>
              </button>

              <button
                onClick={resetAll}
                aria-label="Reset all filters"
                className="ml-1 sm:ml-2 flex-shrink-0 cursor-pointer p-1.5 rounded-lg transition-colors duration-150"
                style={{ background: "none", border: "none", padding: 0 }}
              >
                <RotateCcw size={22} color="#1976D2" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {category && (
            <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
              <span className="text-xs font-semibold" style={{ color: countText }}>
                Active filters:
              </span>
              <button
                onClick={() => setCategory("")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors duration-150"
                style={{ backgroundColor: "#7c3aed", color: "#ffffff" }}
                aria-label={`Remove category filter: ${category}`}
              >
                {category}
                <X size={11} aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Course count — only shown when not loading and no error */}
          {!loading && !error && courses.length > 0 && (
            <p
              className="text-xs sm:text-sm"
              style={{ color: countText }}
              aria-live="polite"
            >
              Showing <span className="font-semibold">{courses.length}</span> course
              {courses.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* ── Course Grid ── */}
        <section aria-label="Course listings">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {renderContent()}
          </div>
        </section>

      </main>
    </div>
  );
}

export default Courses;