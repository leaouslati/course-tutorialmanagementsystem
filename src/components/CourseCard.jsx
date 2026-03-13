import React from "react";
import { users } from "../data/mockdata.js";

function CourseCard({ course }) {
  
  // find instructor from users list
  const instructor = users.find(
    (user) => user.id === course.instructorId
  );

  // Badge logic
const isNew = new Date() - new Date(course.createdAt) < 1000 * 60 * 60 * 24 * 90; // 90 days
  const isAdvanced = course.difficulty === "Advanced";

  //colors
  const difficultyColors = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-yellow-100 text-yellow-800",
  Advanced: "bg-red-100 text-red-800",
};

  return (
<div className="bg-white-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col relative max-w-xl w-full mx-auto overflow-hidden">
          {/* Course Image & Badges */}
          <div className="relative h-40 bg-gray-200">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover rounded-t-xl"
            />
            {/* New Badge */}
            {isNew && (
              <span className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold shadow">
                New
              </span>
            )}
            {/* Updated Badge */}
            {course.rating > 4.7 && (
              <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold shadow">
                Updated
              </span>
            )}
          </div>

          {/* Card Content */}
          <div className="p-6 flex flex-col flex-1">
            {/* Difficulty Badge */}
            <div className="flex items-start w-auto mb-3">
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${difficultyColors[course.difficulty]}`}
              >
                {course.difficulty}
              </span>
            </div>

            {/* Course Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>

      {/* Instructor */}
      <p className="text-sm text-gray-500 mb-2 font-medium">
        {instructor ? instructor.name : "Unknown"}
      </p>


            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {course.shortDescription}
            </p>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">

  <div className="flex items-center gap-1">
    <span>⭐</span>
    <span>{course.rating}</span>
  </div>

  <div className="flex items-center gap-1">
    <span>👥</span>
    <span>{course.studentsCount}</span>
  </div>

</div>

            {/* Button */}
            <button
              className="w-full py-2 rounded-lg text-white font-semibold text-center transition-colors shadow"
              style={{ backgroundColor: '#1976D2' }}
            >
              View Details
            </button>
          </div>
        </div>
      );

}

export default CourseCard;