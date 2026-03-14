import React, { useState } from "react";
import { courses } from "../data/mockdata";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar.jsx";

function Courses({ isLoggedIn }) {
  const [search, setSearch] = useState("");
  const [sortRating, setSortRating] = useState("");
  const [sortTime, setSortTime] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // Filter courses based on search and difficulty
  let filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );
  if (difficulty) {
    filteredCourses = filteredCourses.filter(
      (course) => course.difficulty === difficulty
    );
  }
  // Rating sorting
  if (sortRating === "asc") {
    filteredCourses = [...filteredCourses].sort((a, b) => a.rating - b.rating);
  }
  if (sortRating === "desc") {
    filteredCourses = [...filteredCourses].sort((a, b) => b.rating - a.rating);
  }

  // Duration sorting
  if (sortTime === "asc") {
    filteredCourses = [...filteredCourses].sort((a, b) => a.duration - b.duration);
  }
  if (sortTime === "desc") {
    filteredCourses = [...filteredCourses].sort((a, b) => b.duration - a.duration);
  }
  return (
    <div className="min-h-screen bg-[#F4F8FD]">
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} light />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-left">
          Available Courses
        </h1>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-[#1976D2] bg-white text-black
                       focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2]"
          />
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            {/* Rating Filter */}
            <select
              value={sortRating}
              onChange={(e) => setSortRating(e.target.value)}
              className="border border-[#1976D2] bg-white text-black rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2]"
            >
              <option value="">Rating</option>
              <option value="asc">Lowest → Highest</option>
              <option value="desc">Highest → Lowest</option>
            </select>

            {/* Duration Filter */}
            <select
              value={sortTime}
              onChange={(e) => setSortTime(e.target.value)}
              className="border border-[#1976D2] bg-white text-black rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2]"
            >
              <option value="">Duration</option>
              <option value="asc">Shortest → Longest</option>
              <option value="desc">Longest → Shortest</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border border-[#1976D2] bg-white text-black rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-[#1976D2]"
            >
              <option value="">Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <p className="text-center text-gray-700 col-span-full text-lg mt-4">
              No results
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Courses;
