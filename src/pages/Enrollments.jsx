import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { courses, users, modules } from "../data/mockdata.js";
import { LayoutGrid, Clock } from "lucide-react";

function Enrollments() {
  const currentUser = users[0];

  const enrolledCourses = Array.isArray(currentUser?.enrolledCourses)
    ? courses.filter((course) => currentUser.enrolledCourses.includes(course.id))
    : [];

  const getInstructorName = (id) =>
    users.find((user) => user.id === id)?.name || "Unknown Instructor";

  const countLessons = (course) => {
    if (!Array.isArray(course.modules)) return 0;
    return modules
      .filter((m) => course.modules.includes(m.id))
      .reduce((total, m) => total + (Array.isArray(m.lessons) ? m.lessons.length : 0), 0);
  };

  const computeProgress = (course) => currentUser?.progress?.[course.id] ?? 0;

  const getStatus = (progress) => {
    if (progress === 100)
      return { label: "Completed",   cls: "bg-green-100 text-green-800 border border-green-300 font-bold" };
    if (progress > 0)
      return { label: "In Progress", cls: "bg-yellow-100 text-yellow-800 border border-yellow-300 font-bold" };
    return   { label: "Not Started", cls: "bg-gray-100 text-gray-700 border border-gray-300 font-bold" };
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD]">
      <Navbar isLoggedIn={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Enrollments
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-semibold mb-1">
            Continue your courses and keep up with your progress.
          </p>
          <p className="text-sm text-slate-400" aria-live="polite">
            {enrolledCourses.length}{" "}
            {enrolledCourses.length === 1 ? "course" : "courses"} enrolled
          </p>
        </header>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
              No Enrollments Yet
            </h2>
            <p className="text-gray-600 mb-5 max-w-md mx-auto">
              You are not enrolled in any courses yet. Start exploring courses and begin learning.
            </p>
            <Link
              to="/courses"
              className="inline-block py-2 px-6 rounded-lg text-white font-semibold shadow transition-colors duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2"
              style={{ backgroundColor: "#1976D2" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1565C0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <ol
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            aria-label="Enrolled courses"
          >
            {enrolledCourses.map((course) => {
              const progress    = computeProgress(course);
              const lessons     = countLessons(course);
              const status      = getStatus(progress);
              const remaining   = Math.round(course.duration * (1 - progress / 100));
              const barColor    = progress === 100 ? "#22C55E" : "#1976D2";
              const actionLabel = progress === 100 ? "Review" : progress > 0 ? "Continue" : "Start";
              const moduleCount = Array.isArray(course.modules) ? course.modules.length : 0;

              return (
                <li
                  key={course.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 list-none"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-snug">
                        {course.title}
                      </h2>
                      <p className="text-sm text-gray-500 font-medium truncate">
                        {getInstructorName(course.instructorId)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${status.cls}`}
                      aria-label={`Status: ${status.label}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Category:</span>{" "}
                    {course.category || "General"}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LayoutGrid className="w-4 h-4 text-[#1976D2] flex-shrink-0" aria-hidden="true" />
                    <span>
                      {moduleCount} {moduleCount === 1 ? "module" : "modules"}{" "}
                      · {lessons} {lessons === 1 ? "lesson" : "lessons"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-[#22C55E] flex-shrink-0" aria-hidden="true" />
                    <span>{remaining} min left</span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span id={`progress-label-${course.id}`}>Progress</span>
                      <span className="font-semibold" style={{ color: barColor }}>
                        {progress}%
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-labelledby={`progress-label-${course.id}`}
                      className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden"
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${progress}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <Link
                      to={`/courses/${course.id}`}
                      aria-label={`${actionLabel} ${course.title}`}
                      className="text-sm font-semibold text-[#1976D2] hover:text-[#1565C0] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2 rounded"
                    >
                      {actionLabel} →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </main>
    </div>
  );
}

export default Enrollments;
