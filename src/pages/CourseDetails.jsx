import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courses, modules, lessons, users } from "../data/mockdata";
import ModuleAccordion from "../components/ModuleAccordion";
import Navbar from "../components/Navbar";

function CourseDetail({ isLoggedIn }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F4F8FD] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Course not found.</p>
      </div>
    );
  }

  const instructor = users.find((u) => u.id === course.instructorId);

  // Resolve modules and their lessons from IDs
  const courseModules = course.modules
    .map((moduleId) => {
      const mod = modules.find((m) => m.id === moduleId);
      if (!mod) return null;
      const moduleLessons = mod.lessons
        .map((lessonId) => lessons.find((l) => l.id === lessonId))
        .filter(Boolean);
      return { ...mod, lessons: moduleLessons };
    })
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  const totalLessons = courseModules.reduce(
    (sum, mod) => sum + mod.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-[#F4F8FD]">
      <Navbar isLoggedIn={isLoggedIn} light />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6"
          style={{ border: "0.5px solid #e0e0e0" }}>
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-56 object-cover"
          />
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                {course.category}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                {course.difficulty}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {course.title}
            </h1>
            <p className="text-gray-600 mb-4">{course.description}</p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <span>⭐ {course.rating} rating</span>
              <span>👥 {course.studentsCount} students</span>
              <span>⏱ {course.duration} min total</span>
              <span>📚 {totalLessons} lessons</span>
              {instructor && <span>👤 {instructor.name}</span>}
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ border: "0.5px solid #e0e0e0" }}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Course Content
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {courseModules.length} modules • {totalLessons} lessons
          </p>
          <ModuleAccordion modules={courseModules} />
        </div>

      </div>
    </div>
  );
}

export default CourseDetail;