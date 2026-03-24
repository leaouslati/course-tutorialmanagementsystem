import React from "react";
import { Link } from "react-router-dom";
import { users } from "../data/mockdata.js";
import { Clock, Users, Star } from "lucide-react";

function CourseCard({ course }) {
  const instructor = users.find((user) => user.id === course.instructorId);
  const isNew = new Date() - new Date(course.createdAt) < 1000 * 60 * 60 * 24 * 90;

  const difficultyColors = {
    Beginner:     "bg-green-100  text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced:     "bg-red-100    text-red-800",
  };

  return (
    <article
      className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden h-full"
      aria-labelledby={`course-title-${course.id}`}
    >
      <div className="relative h-40 sm:h-44 bg-gray-200 flex-shrink-0">
        <img
          src={course.image}
          alt={`Cover image for ${course.title}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isNew && (
          <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm">
            New
          </span>
        )}
        {course.rating > 4.7 && (
          <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm">
            Updated
          </span>
        )}
      </div>

     
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2 justify-between">

      
        <span
          className={`self-start text-xs font-semibold px-2.5 py-0.5 rounded-full ${difficultyColors[course.difficulty]}`}
          aria-label={`Difficulty: ${course.difficulty}`}
        >
          {course.difficulty}
        </span>

       
        <h2
          id={`course-title-${course.id}`}
          className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2"
        >
          {course.title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
          {instructor ? instructor.name : "Unknown Instructor"}
        </p>

           <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
      {course.shortDescription}
    </p>
        <div
          className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1"
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

        <div className="mt-auto pt-3">
     <Link
  to={`/courses/${course.id}`}
  className="block w-full py-2 rounded-lg text-md font-semibold text-center shadow-sm
             transition-colors duration-200 focus:outline-none focus-visible:ring-2
             focus-visible:ring-blue-500 focus-visible:ring-offset-2"
  style={{ backgroundColor: "#1976D2", color: "#fff" }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0094c5")}
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