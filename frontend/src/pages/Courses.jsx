import React, { useState, useEffect } from "react";
import { courses } from "../data/mockdata";
import CourseCard from "../components/CourseCard";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { Search, RotateCcw, BookOpen, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";

function Courses({ darkMode = false }) {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sortRating, setSortRating] = useState("");
  const [sortTime, setSortTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  const resetAll = () => {
    setSearch("");
    setSortRating("");
    setSortTime("");
    setDifficulty("");
    setCategory("");
  };


  const pageBg = darkMode ? "#060f1e" : "#F4F8FD";
  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder = darkMode ? "#1a3a6b" : "transparent";
  const headingCol = darkMode ? "#f1f5f9" : "#111827";
  const subCol = darkMode ? "#94a3b8" : "#4b5563";
  const inputText = darkMode ? "#f1f5f9" : "#1f2937";
  const inputPlaceholder = darkMode ? "#64748b" : "#9ca3af";
  const countText = darkMode ? "#94a3b8" : "#4b5563";


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

  const filterBtnClass = "px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg transition-all duration-150 whitespace-nowrap";

  let filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  if (difficulty) filteredCourses = filteredCourses.filter((c) => c.difficulty === difficulty);
  if (category) filteredCourses = filteredCourses.filter((c) => c.category === category);
  if (sortRating === "asc") filteredCourses = [...filteredCourses].sort((a, b) => a.rating - b.rating);
  if (sortRating === "desc") filteredCourses = [...filteredCourses].sort((a, b) => b.rating - a.rating);
  if (sortTime === "asc") filteredCourses = [...filteredCourses].sort((a, b) => a.duration - b.duration);
  if (sortTime === "desc") filteredCourses = [...filteredCourses].sort((a, b) => b.duration - a.duration);

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
            style={{
              fontSize: "clamp(2.35rem, 4vw, 3rem)",
              color: headingCol,
            }}
          >
            Available Courses
          </h1>
          <p
            className="font-semibold text-left"
            style={{
              fontSize: "clamp(0.8rem, 2.5vw, 1.25rem)",
              color: subCol,
            }}
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
                style={{
                  ...(sortRating ? btnActive : btnBase),
                  width: "100px",
                  flexShrink: 0,
                }}
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
                style={{
                  ...(sortTime ? btnActive : btnBase),
                  width: "110px",
                  flexShrink: 0,
                }}
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

          {/* Active filter chips — show which filters are currently applied */}
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

          {/* Course count */}
          {courses.length > 0 && (
            <p
              className="text-xs sm:text-sm"
              style={{ color: countText }}
              aria-live="polite"
            >
              Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
              <span className="font-semibold">{courses.length}</span> courses
            </p>
          )}
        </div>

        {/* ── Course Grid ── */}
        <section aria-label="Course listings">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">

            {courses.length === 0 ? (
              <EmptyState
                darkMode={darkMode}
                icon={<BookOpen className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: "#60a5fa" }} />}
                title="No courses available"
                message="There are currently no courses in the system. Please check back later or contact an instructor."
              />

            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} darkMode={darkMode} />
              ))

            ) : (
              <EmptyState
                darkMode={darkMode}
                icon={<Search className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: "#60a5fa" }} />}
                title="No courses found"
                message="Try adjusting your search or filters to discover more courses."
                action={
                  <Button variant="primary" size="md" darkMode={darkMode} onClick={resetAll} className="shadow">
                    Reset Filters
                  </Button>
                }
              />
            )}

          </div>
        </section>

      </main>
    </div>
  );
}

export default Courses;