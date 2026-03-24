import React from "react";
import { Link } from "react-router-dom";
import { users } from "../data/mockdata.js";
import { Clock, Users, Star } from "lucide-react";

function CourseCard({ course, darkMode = false }) {
  const instructor = users.find((user) => user.id === course.instructorId);
  const isNew = new Date() - new Date(course.createdAt) < 1000 * 60 * 60 * 24 * 90;

  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder = darkMode ? "#1a3a6b" : "#e5e7eb";
  const headingColor = darkMode ? "#f1f5f9" : "#111827";
  const subColor = darkMode ? "#94a3b8" : "#6b7280";
  const bodyText = darkMode ? "#cbd5e1" : "#4b5563";
  const statColor = darkMode ? "#94a3b8" : "#6b7280";


  const difficultyColors = {
    Beginner: darkMode ? "bg-green-900 text-green-200 border border-green-700" : "bg-green-100 text-green-800",
    Intermediate: darkMode ? "bg-yellow-900 text-yellow-200 border border-yellow-700" : "bg-yellow-100 text-yellow-800",
    Advanced: darkMode ? "bg-red-900 text-red-200 border border-red-700" : "bg-red-100 text-red-800",
  };

  const newBadge = darkMode
    ? "bg-[#0f1f3d] text-blue-200 border border-[#1a3a6b]"
    : "bg-white/90 text-gray-800";

  const updatedBadge = darkMode
    ? "bg-yellow-600 text-yellow-200 border border-yellow-700"
    : "bg-yellow-100 text-yellow-800";

  return (
    <article
      className="rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${cardBorder}`,
      }}
      aria-labelledby={`course-title-${course.id}`}
    >
      {/* ── Thumbnail ── */}
      <div className="relative h-40 sm:h-44 bg-gray-200 flex-shrink-0">
        <img
          src={course.image}
          alt={`Cover image for ${course.title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isNew && (
          <span className={`absolute top-3 left-3 text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm ${newBadge}`}>
            New
          </span>
        )}
        {course.rating > 4.7 && (
          <span className={`absolute top-3 right-3 text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm ${updatedBadge}`}>
            Updated
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2 justify-between">

        {/* Difficulty badge */}
        <span
          className={`self-start text-xs font-semibold px-2.5 py-0.5 rounded-full ${difficultyColors[course.difficulty]}`}
          aria-label={`Difficulty: ${course.difficulty}`}
        >
          {course.difficulty}
        </span>

        {/* Title */}
        <h2
          id={`course-title-${course.id}`}
          className="text-base sm:text-lg font-bold leading-snug line-clamp-2"
          style={{ color: headingColor }}
        >
          {course.title}
        </h2>

        {/* Instructor */}
        <p className="text-xs sm:text-sm font-medium truncate" style={{ color: subColor }}>
          {instructor ? instructor.name : "Unknown Instructor"}
        </p>

        {/* Description */}
        <p
          className="text-xs sm:text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]"
          style={{ color: bodyText }}
        >
          {course.shortDescription}
        </p>

        {/* ── Stats ── */}
        <div
          className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm mt-1"
          style={{ color: statColor }}
          aria-label="Course statistics"
        >
          <div className="flex items-center gap-1" aria-label={`Duration: ${course.duration} minutes`}>
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
            <span>{course.duration} min</span>
          </div>

          <div className="flex items-center gap-1" aria-label={`${course.studentsCount} students enrolled`}>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" aria-hidden="true" />
            <span>{course.studentsCount}</span>
          </div>

          <div className="flex items-center gap-1" aria-label={`Rating: ${course.rating} out of 5`}>
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" aria-hidden="true" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-auto pt-3">
          <Link
            to={`/courses/${course.id}`}
            className="block w-full py-2 rounded-lg text-sm font-semibold text-center !text-white shadow-sm transition-colors duration-200 focus:outline-none"
            style={{ backgroundColor: "#1976D2" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
            aria-label={`View details for ${course.title}`}
          >
            View Details
          </Link>
        </div>

      </div>
    </article>
  );
}

export default CourseCard;