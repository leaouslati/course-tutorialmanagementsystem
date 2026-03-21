import React, { useState } from "react";
import { courses } from "../data/mockdata";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar.jsx";
import { Search, RotateCcw, BookOpen } from 'lucide-react';

function Courses({ isLoggedIn }) {
  const [search, setSearch] = useState("");
  const [sortRating, setSortRating] = useState("");
  const [sortTime, setSortTime] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const resetFilters = () => {
    setSearch("");
    setSortRating("");
    setSortTime("");
    setDifficulty("");
  };

  const filterBtnClass = "shadow w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg transition-all duration-150";

  const filterBtnStyle = {
    backgroundColor: '#fff',
    color: '#424242',
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
    border: 'none',
  };

  const filterBtnActiveStyle = {
    backgroundColor: '#1976D2',
    color: '#fff',
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
    border: 'none',
  };

  let filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );
  if (difficulty) {
    filteredCourses = filteredCourses.filter((course) => course.difficulty === difficulty);
  }
  if (sortRating === "asc") filteredCourses = [...filteredCourses].sort((a, b) => a.rating - b.rating);
  if (sortRating === "desc") filteredCourses = [...filteredCourses].sort((a, b) => b.rating - a.rating);
  if (sortTime === "asc") filteredCourses = [...filteredCourses].sort((a, b) => a.duration - b.duration);
  if (sortTime === "desc") filteredCourses = [...filteredCourses].sort((a, b) => b.duration - a.duration);

  return (
    <div className="min-h-screen bg-[#F4F8FD]">
      <Navbar isLoggedIn={isLoggedIn} light />

      <main className="max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">

       <h1
  className="font-bold text-gray-900 text-left whitespace-nowrap mb-2 sm:mb-4"
  style={{ fontSize: 'clamp(1.1rem, 4vw, 3rem)' }}
>
  Available Courses
</h1>
        <p
          className="text-gray-600 mb-4 sm:mb-8 text-left font-semibold"
          style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1.25rem)' }}
        >
          Learn. Grow. Achieve.
        </p>

        <div className="flex flex-col gap-3 sm:gap-4 mb-5 sm:mb-8">

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
              style={{ border: 'none', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}
            />
          </div>

          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">

            <div className="flex flex-wrap gap-2">
              {['', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={filterBtnClass}
                  style={difficulty === level ? filterBtnActiveStyle : filterBtnStyle}
                  aria-pressed={difficulty === level}
                >
                  {level === '' ? 'All Levels' : level}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSortRating(sortRating === "desc" ? "asc" : "desc")}
                className={filterBtnClass}
                style={sortRating ? filterBtnActiveStyle : filterBtnStyle}
                aria-label={`Sort by rating ${sortRating === "asc" ? "descending" : "ascending"}`}
              >
                Rating{sortRating ? (sortRating === "asc" ? " ↑" : " ↓") : ""}
              </button>
              <button
                onClick={() => setSortTime(sortTime === "desc" ? "asc" : "desc")}
                className={filterBtnClass}
                style={sortTime ? filterBtnActiveStyle : filterBtnStyle}
                aria-label={`Sort by duration ${sortTime === "asc" ? "descending" : "ascending"}`}
              >
                Duration{sortTime ? (sortTime === "asc" ? " ↑" : " ↓") : ""}
              </button>
              <RotateCcw
                onClick={resetFilters}
                className="ml-1 sm:ml-2 cursor-pointer flex-shrink-0"
                size={22}
                color="#1976D2"
                style={{ background: 'none', boxShadow: 'none', border: 'none' }}
                title="Reset filters"
                role="button"
                tabIndex={0}
                onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') resetFilters(); }}
              />
            </div>
          </div>

          {(search || difficulty || sortRating || sortTime) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs sm:text-sm text-gray-600">Active filters:</span>
              {search && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm">
                  Search: "{search}"
                </span>
              )}
              {difficulty && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm">
                  {difficulty}
                </span>
              )}
              {sortRating && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm">
                  Rating {sortRating === "asc" ? "↑" : "↓"}
                </span>
              )}
              {sortTime && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm">
                  Duration {sortTime === "asc" ? "↑" : "↓"}
                </span>
              )}
            </div>
          )}

          {courses.length > 0 && (
            <p className="text-xs sm:text-sm text-gray-600" aria-live="polite">
              Showing <span className="font-semibold">{filteredCourses.length}</span> of{" "}
              <span className="font-semibold">{courses.length}</span> courses
            </p>
          )}
        </div>

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
                  onClick={resetFilters}
                  className="mt-2 px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                   style={{ backgroundColor: "#1976D2" }}
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