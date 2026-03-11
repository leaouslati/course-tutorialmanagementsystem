// src/components/CourseCard.jsx
import React from "react";
import { users } from "../data/mockdata.jsx";

function CourseCard({ course }) {
  const instructor = users.find(user => user.id === course.instructorId);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition relative overflow-hidden">
      {/* Difficulty / Highlight badge */}
      <span className="absolute top-4 left-4 bg-[#90CAF9] text-[#1976D2] text-xs px-2 py-1 rounded">
        {course.difficulty}
      </span>

      {/* Updated badge for high rating */}
      {course.rating > 4.7 && (
        <span className="absolute top-4 right-4 bg-[#FEF3C7] text-xs px-2 py-1 rounded">
          Updated
        </span>
      )}

      {/* Course Image */}
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-44 object-cover"
      />

      {/* Card Content */}
      <div className="p-5 flex flex-col justify-between h-[220px]">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-1 line-clamp-2">{course.title}</h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600 mb-2">
          {instructor ? instructor.name : "Unknown"}
        </p>

        {/* Short Description */}
        <p className="text-sm text-gray-500 mb-3 line-clamp-3">
          {course.shortDescription}
        </p>

        {/* Rating and Students */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>⭐ {course.rating}</span>
          <span>👥 {course.studentsCount}</span>
        </div>

        {/* View Details Button */}
        <button className="mt-auto w-full py-2 bg-[#1976D2] text-white rounded-lg hover:opacity-90 transition">
          View Details
        </button>
      </div>
    </div>
  );
}

export default CourseCard;