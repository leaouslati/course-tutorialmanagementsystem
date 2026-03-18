import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { courses, users } from "../data/mockdata.js";
import { BookOpen, CheckCircle, BarChart3, Layers } from "lucide-react";

function Enrollments() {
  const currentUser = users[0];

  const enrolledCourses = Array.isArray(currentUser?.enrolledCourses)
    ? courses.filter((course) => currentUser.enrolledCourses.includes(course.id))
    : [];

  const getInstructorName = (id) =>
    users.find((user) => user.id === id)?.name || "Unknown Instructor";

  const countLessons = (course) =>
    Array.isArray(course.modules)
      ? course.modules.reduce(
          (total, module) =>
            total + (Array.isArray(module.lessons) ? module.lessons.length : 0),
          0
        )
      : 0;

  const calculateProgress = (course) => {
    if (!currentUser?.progress || !Array.isArray(course.modules)) return 0;

    let totalLessons = 0;
    let completedLessons = 0;

    course.modules.forEach((module) => {
      if (Array.isArray(module.lessons)) {
        module.lessons.forEach((lesson) => {
          totalLessons += 1;
          if (currentUser.progress[lesson.id]) {
            completedLessons += 1;
          }
        });
      }
    });

    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const completedCourses = enrolledCourses.filter(
    (course) => calculateProgress(course) === 100
  ).length;

  const averageProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce(
            (sum, course) => sum + calculateProgress(course),
            0
          ) / enrolledCourses.length
        )
      : 0;

  const totalLessons = enrolledCourses.reduce(
    (sum, course) => sum + countLessons(course),
    0
  );

  return (
    <div className="min-h-screen bg-[#F4F8FD]">
      <Navbar isLoggedIn={true} />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 text-left">
          My Enrollments
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-left font-semibold">
          Keep learning and track your progress.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-[#1976D2]" />
              <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {enrolledCourses.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-[#22C55E]" />
              <p className="text-sm font-medium text-gray-500">Completed Courses</p>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {completedCourses}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-yellow-500" />
              <p className="text-sm font-medium text-gray-500">Average Progress</p>
            </div>
            <h2 className="text-3xl font-bold text-[#22C55E]">
              {averageProgress}%
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center gap-3 mb-3">
              <Layers className="w-6 h-6 text-[#1976D2]" />
              <p className="text-sm font-medium text-gray-500">Total Lessons</p>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {totalLessons}
            </h2>
          </div>
        </div>

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
              const progress = calculateProgress(course);
              const lessons = countLessons(course);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden hover:-translate-y-1 transition-transform h-full"
                >
                  <div className="relative h-44 bg-gray-200">
                    <img
                      src={course.image}
                      alt={`Cover image for ${course.title}`}
                      className="w-full h-full object-cover rounded-t-xl"
                    />
                    <span
                      className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-semibold shadow ${
                        progress === 100
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {progress === 100 ? "Completed" : "In Progress"}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-2 font-medium">
                      {getInstructorName(course.instructorId)}
                    </p>

                    <p className="text-sm text-gray-600 mb-2">
                      Category: {course.category || "General"}
                    </p>

                    <p className="text-sm text-gray-600 mb-4">
                      {Array.isArray(course.modules) ? course.modules.length : 0} modules •{" "}
                      {lessons} lessons
                    </p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span className="font-semibold text-[#22C55E]">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#22C55E]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center gap-3">
                      <Link
                        to="/courses"
                        className="py-2 px-4 rounded-lg text-white font-semibold text-center shadow transition-colors duration-300 hover:shadow-lg"
                        style={{ backgroundColor: "#1976D2" }}
                      >
                        Continue Learning
                      </Link>

                      <Link
                        to="/courses"
                        className="text-sm font-semibold text-[#0D47A1] hover:text-[#1976D2] transition"
                      >
                        View Details
                      </Link>
                    </div>
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