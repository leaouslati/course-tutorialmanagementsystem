import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { courses, users, modules } from "../data/mockdata.js";

function Enrollments() {
  const currentUser = users[0];

  const enrolledCourses = Array.isArray(currentUser?.enrolledCourses)
    ? courses.filter((course) => currentUser.enrolledCourses.includes(course.id))
    : [];

  const getInstructorName = (id) =>
    users.find((user) => user.id === id)?.name || "Unknown Instructor";

  const countLessons = (course) => {
    if (!Array.isArray(course.modules)) return 0;

    const matchedModules = modules.filter((module) =>
      course.modules.includes(module.id)
    );

    return matchedModules.reduce(
      (total, module) =>
        total + (Array.isArray(module.lessons) ? module.lessons.length : 0),
      0
    );
  };

  const computeProgress = (course) => {
    if (!currentUser?.progress) return 0;
    return currentUser.progress[course.id] ?? 0;
  };

  const getStatus = (progress) => {
    if (progress === 100) return "Completed";
    if (progress > 0) return "In Progress";
    return "Not Started";
  };

  const getStatusClasses = (progress) => {
    if (progress === 100) return "bg-green-100 text-green-800";
    if (progress > 0) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD]">
      <Navbar isLoggedIn={true} />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 text-left">
          My Enrollments
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-left font-semibold">
          Continue your courses and keep up with your progress.
        </p>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No Enrollments Yet
            </h2>
            <p className="text-gray-600 mb-5">
              You are not enrolled in any courses yet. Start exploring courses and begin learning.
            </p>
            <Link
              to="/courses"
              className="inline-block py-2 px-6 rounded-lg text-white font-semibold shadow transition-colors duration-300 hover:shadow-lg"
              style={{ backgroundColor: "#1976D2" }}
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => {
              const progress = computeProgress(course);
              const lessons = countLessons(course);
              const status = getStatus(progress);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {course.title}
                      </h2>
                      <p className="text-sm text-gray-500 font-medium">
                        {getInstructorName(course.instructorId)}
                      </p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${getStatusClasses(
                        progress
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Category: {course.category || "General"}</p>
                    <p>
                      {Array.isArray(course.modules) ? course.modules.length : 0} modules •{" "}
                      {lessons} lessons
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span className="font-semibold text-[#22C55E]">{progress}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#22C55E]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D47A1] hover:text-[#1976D2] transition"
                    >
                      Continue →
                    </Link>

                    <Link
                      to="/courses"
                      className="text-sm font-semibold text-[#0D47A1] hover:text-[#1976D2] transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Enrollments;