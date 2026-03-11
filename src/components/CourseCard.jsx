import React from "react";
import { users } from "../data";

function CourseCard({ course }) {
  
  // find instructor from users list
  const instructor = users.find(
    (user) => user.id === course.instructorId
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition relative">

      {/* Highlight badge */}
      {course.rating > 4.7 && (
        <span className="absolute top-4 right-4 bg-[#FEF3C7] text-xs px-2 py-1 rounded">
          Updated
        </span>
      )}

      {/* Course Image */}
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />

      {/* Course Title */}
      <h3 className="text-xl font-semibold mb-2">
        {course.title}
      </h3>

      {/* Instructor */}
      <p className="text-sm text-gray-600 mb-1">
        Instructor: {instructor ? instructor.name : "Unknown"}
      </p>

      {/* Difficulty Badge */}
      <span className="inline-block bg-[#90CAF9] text-[#1976D2] text-xs px-2 py-1 rounded mb-3">
        {course.difficulty}
      </span>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">
        {course.shortDescription}
      </p>

      {/* Button */}
      <button className="px-4 py-2 rounded-lg bg-[#1976D2] text-white hover:opacity-90 transition">
        View Details
      </button>

    </div>
  );
}

export default CourseCard;