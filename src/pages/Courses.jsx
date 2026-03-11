// src/pages/Courses.jsx
import React from "react";
import { courses } from "../data/mockdata.jsx";
import CourseCard from "../components/CourseCard.jsx";

function Courses() {
  return (
    <div className="bg-[#F4F8FD] min-h-screen w-full py-8 px-4">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-10">All Courses</h1>

      {/* Courses Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default Courses;