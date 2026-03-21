import React, { useState } from "react";
import { courses } from "../data/mockdata";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar.jsx";
import { Search, RotateCcw } from 'lucide-react';

function Courses({ isLoggedIn }) {
  const [search, setSearch] = useState("");
  const [sortRating, setSortRating] = useState("");
  const [sortTime, setSortTime] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const filterBtnClass = "shadow w-full sm:w-auto max-w-[8rem] sm:max-w-[8rem] sm:px-4 sm:py-2 px-2 py-1 text-[0.9rem] sm:text-base";
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
    filteredCourses = filteredCourses.filter(
      (course) => course.difficulty === difficulty
    );
  }
  if (sortRating === "asc") {
    filteredCourses = [...filteredCourses].sort((a, b) => a.rating - b.rating);
  }
  if (sortRating === "desc") {
    filteredCourses = [...filteredCourses].sort((a, b) => b.rating - a.rating);
  }
  if (sortTime === "asc") {
    filteredCourses = [...filteredCourses].sort((a, b) => a.duration - b.duration);
  }
  if (sortTime === "desc") {
    filteredCourses = [...filteredCourses].sort((a, b) => b.duration - a.duration);
  }

  return (
    <div className="min-h-screen bg-[#F4F8FD]">
      <Navbar isLoggedIn={isLoggedIn} light />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-left">
          Available Courses
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-left font-semibold">
          Learn. Grow. Achieve.
        </p>

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center mb-2">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 py-3 bg-white p-4 rounded-lg shadow text-gray-800"
                style={{ border: 'none', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-2 sm:mb-0">
              <button onClick={() => setDifficulty('')} className={filterBtnClass} style={difficulty === '' ? filterBtnActiveStyle : filterBtnStyle}>All Levels</button>
              <button onClick={() => setDifficulty('Beginner')} className={filterBtnClass} style={difficulty === 'Beginner' ? filterBtnActiveStyle : filterBtnStyle}>Beginner</button>
              <button onClick={() => setDifficulty('Intermediate')} className={filterBtnClass} style={difficulty === 'Intermediate' ? filterBtnActiveStyle : filterBtnStyle}>Intermediate</button>
              <button onClick={() => setDifficulty('Advanced')} className={filterBtnClass} style={difficulty === 'Advanced' ? filterBtnActiveStyle : filterBtnStyle}>Advanced</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <button onClick={() => setSortRating(sortRating === "desc" ? "asc" : "desc")} className={filterBtnClass} style={sortRating ? filterBtnActiveStyle : filterBtnStyle}>
                  Rating{sortRating ? (sortRating === "asc" ? " ↑" : " ↓") : ""}
                </button>
                <button onClick={() => setSortTime(sortTime === "desc" ? "asc" : "desc")} className={filterBtnClass} style={sortTime ? filterBtnActiveStyle : filterBtnStyle}>
                  Duration{sortTime ? (sortTime === "asc" ? " ↑" : " ↓") : ""}
                </button>
                <RotateCcw
                  onClick={() => { setSearch(""); setSortRating(""); setSortTime(""); setDifficulty(""); }}
                  className="ml-2 sm:ml-4 cursor-pointer"
                  size={28}
                  color="#1976D2"
                  style={{ border: 'none', outline: 'none', background: 'none', boxShadow: 'none' }}
                  title="Reset filters"
                  role="button"
                  tabIndex={0}
                  onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') { setSearch(""); setSortRating(""); setSortTime(""); setDifficulty(""); } }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center col-span-full py-16">
              <Search className="mb-4 w-12 h-12 text-blue-400" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No courses available</h2>
              <p className="text-gray-500 text-base mb-4">There are currently no courses in the system.</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center col-span-full py-16">
              <Search className="mb-4 w-12 h-12 text-blue-400" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">No courses found</h2>
              <p className="text-gray-500 text-base mb-4">Try adjusting your search or filters.</p>
              <button
                onClick={() => { setSearch(""); setSortRating(""); setSortTime(""); setDifficulty(""); }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Courses;