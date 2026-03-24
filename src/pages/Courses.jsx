import React, { useState, useEffect } from "react";
import { courses } from "../data/mockdata";
import CourseCard from "../components/CourseCard";
import { Search, RotateCcw, BookOpen } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../pages/AuthContext";

function Courses() {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [search, setSearch]       = useState("");
  const [sortRating, setSortRating] = useState("");
  const [sortTime, setSortTime]   = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory]   = useState("");

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

  const filterBtnClass = "shadow px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg transition-all duration-150 whitespace-nowrap";
  const filterBtnStyle = {
    backgroundColor: "#fff",
    color: "#424242",
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
    border: "none",
  };
  const filterBtnActiveStyle = {
    backgroundColor: "#1976D2",
    color: "#fff",
    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
    border: "none",
  };

  let filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  if (difficulty) filteredCourses = filteredCourses.filter((c) => c.difficulty === difficulty);
  if (category)   filteredCourses = filteredCourses.filter((c) => c.category === category);
  if (sortRating === "asc")  filteredCourses = [...filteredCourses].sort((a, b) => a.rating - b.rating);
  if (sortRating === "desc") filteredCourses = [...filteredCourses].sort((a, b) => b.rating - a.rating);
  if (sortTime === "asc")    filteredCourses = [...filteredCourses].sort((a, b) => a.duration - b.duration);
  if (sortTime === "desc")   filteredCourses = [...filteredCourses].sort((a, b) => b.duration - a.duration);

  return (
    <div className="min-h-screen bg-[#F4F8FD]">


      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-8 sm:pb-12">

        <header className="mb-4 sm:mb-6">
          <h1
            className="font-bold text-gray-900 text-left mb-2"
            style={{ fontSize: "clamp(2.35rem, 4vw, 3rem)" }}
          >
            Available Courses
          </h1>
          <p
            className="text-gray-600 font-semibold text-left"
            style={{ fontSize: "clamp(0.8rem, 2.5vw, 1.25rem)" }}
          >
            Learn. Grow. Achieve.
          </p>
        </header>

        {/* ── Filters ── */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-5 sm:mb-6">

          {/* Search */}
          <div className="relative w-full">
            <Search
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search courses"
              className="w-full pl-10 sm:pl-12 py-2.5 sm:py-3 bg-white rounded-lg text-sm sm:text-base text-gray-800"
              style={{ border: "none", boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)" }}
            />
          </div>

          {/* Difficulty + sort + reset — stacked on mobile, single row on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex flex-wrap gap-2">
              {["", "Beginner", "Intermediate", "Advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`${filterBtnClass} w-full sm:w-auto`}
                  style={difficulty === level ? filterBtnActiveStyle : filterBtnStyle}
                  aria-pressed={difficulty === level}
                >
                  {level === "" ? "All Levels" : level}
                </button>
              ))}
            </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSortRating(sortRating === "desc" ? "asc" : "desc")}
              className={filterBtnClass}
              style={{ ...(sortRating ? filterBtnActiveStyle : filterBtnStyle), width: '100px', flexShrink: 0 }}
              aria-label={`Sort by rating ${sortRating === "asc" ? "descending" : "ascending"}`}
            >
              <span className="flex items-center justify-center gap-1">
                Rating {sortRating === "asc" ? "↑" : sortRating === "desc" ? "↓" : ""}
              </span>
            </button>
            <button
              onClick={() => setSortTime(sortTime === "desc" ? "asc" : "desc")}
              className={filterBtnClass}
              style={{ ...(sortTime ? filterBtnActiveStyle : filterBtnStyle), width: '110px', flexShrink: 0 }}
              aria-label={`Sort by duration ${sortTime === "asc" ? "descending" : "ascending"}`}
            >
              <span className="flex items-center justify-center gap-1">
                Duration {sortTime === "asc" ? "↑" : sortTime === "desc" ? "↓" : ""}
              </span>
            </button>
            <button
              onClick={resetAll}
              aria-label="Reset all filters"
              className="ml-1 sm:ml-2 flex-shrink-0 cursor-pointer"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <RotateCcw size={22} color="#1976D2" aria-hidden="true" />
            </button>
          </div>
          </div>

          {/* Course count */}
          {courses.length > 0 && (
            <p className="text-xs sm:text-sm text-gray-600" aria-live="polite">
              Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
              <span className="font-semibold">{courses.length}</span> courses
            </p>
          )}
        </div>

        {/* ── Course grid ── */}
        <section aria-label="Course listings">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {courses.length === 0 ? (
              <div className="flex flex-col items-center justify-center col-span-full py-12 sm:py-16 px-4 text-center">
                <BookOpen className="mb-3 w-8 h-8 sm:w-12 sm:h-12 text-blue-400" aria-hidden="true" />
                <h2 className="text-base sm:text-2xl font-semibold text-gray-700 mb-2">
                  No courses available
                </h2>
                <p className="text-gray-500 text-xs sm:text-base mb-4">
                  There are currently no courses in the system. Please check back later or contact an instructor.
                </p>
              </div>
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center col-span-full py-12 sm:py-16 px-4 text-center">
                <Search className="mb-3 w-8 h-8 sm:w-12 sm:h-12 text-blue-400" aria-hidden="true" />
                <h2 className="text-base sm:text-2xl font-semibold text-gray-700 mb-2">
                  No courses found
                </h2>
                <p className="text-gray-500 text-xs sm:text-base mb-4">
                  Try adjusting your search or filters to discover more courses.
                </p>
                <button
                  onClick={resetAll}
                  className="mt-2 px-4 py-2 text-sm sm:text-base text-white rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ backgroundColor: "#1976D2" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2196F3")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

export default Courses;