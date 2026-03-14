
import React from "react";
import { courses } from "../data/mockdata";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar.jsx";

function Courses({ isLoggedIn }) {
  return (
    <div className="min-h-screen bg-[#F4F8FD]">
      {/* Navbar at the top */}
      <Navbar isLoggedIn={isLoggedIn} light />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-10 text-left">
          Available Courses
        </h1>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

    </div>
  );
}
export default Courses;
