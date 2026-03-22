import React from "react";
import { Link } from "react-router-dom";
import { users } from "../data/mockdata.js";
import { Clock } from "lucide-react";

function CourseCard({ course }) {
  const instructor = users.find((user) => user.id === course.instructorId);
  const isNew = new Date() - new Date(course.createdAt) < 1000 * 60 * 60 * 24 * 90; // 90 days

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  };

  return (
    <article
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden hover:-translate-y-1 transition-transform h-full min-h-[420px]"
      aria-labelledby={`course-title-${course.id}`}
    >
      {/* Course Image & Badges */}
      <div className="relative h-40 bg-gray-200">
        <img
          src={course.image}
          alt={`Cover image for ${course.title}`}
          className="w-full h-full object-cover rounded-t-xl"
        />
        {isNew && (
          <span
            className="absolute top-3 left-3 bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full font-semibold shadow"
            aria-label="New course badge"
          >
            New
          </span>
        )}
        {course.rating > 4.7 && (
          <span
            className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold shadow"
            aria-label="Updated course badge"
          >
            Updated
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Difficulty Badge */}
        <div className="flex items-start w-auto mb-3">
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
              difficultyColors[course.difficulty]
            }`}
            aria-label={`Difficulty level: ${course.difficulty}`}
          >
            {course.difficulty}
          </span>
        </div>

        {/* Course Title */}
        <h2
          id={`course-title-${course.id}`}
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-2"
        >
          {course.title}
        </h2>

        {/* Instructor */}
        <p className="text-sm text-gray-500 mb-2 font-medium">
          {instructor ? instructor.name : "Unknown Instructor"}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.shortDescription}
        </p>

        {/* Stats: Duration, Students, Rating */}
        <section
          aria-label="Course statistics"
          className="flex items-center gap-4 mb-4 text-sm text-gray-600"
        >
          <div className="flex items-center gap-1" aria-label={`Duration: ${course.duration} minutes`}>
            <Clock className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <span>{course.duration} min</span>
          </div>
          <div className="flex items-center gap-1" aria-label={`Students enrolled: ${course.studentsCount}`}>
            <span>👥</span>
            <span>{course.studentsCount}</span>
          </div>
          <div className="flex items-center gap-1" aria-label={`Rating: ${course.rating} stars`}>
            <span>⭐</span>
            <span>{course.rating}</span>
          </div>
        </section>

        {/* View Details Button */}
        <div className="mt-auto">
          <Link to={`/courses/${course.id}`}>
            <button
              className="w-full py-2 rounded-lg text-white font-semibold text-center shadow transition-colors duration-300 hover:shadow-lg
                         focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              style={{ backgroundColor: "#1976D2" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0094c5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
              aria-label={`View details for ${course.title}`}
            >
              View Details
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;