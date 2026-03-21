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
      .reduce(
        (total, m) => total + (Array.isArray(m.lessons) ? m.lessons.length : 0),
        0
      );
  };

  const computeProgress = (course) => currentUser?.progress?.[course.id] ?? 0;

  const getStatus = (progress) => {
    if (progress === 100)
      return {
        label: "Completed",
        cls: "bg-green-100 text-green-800 border border-green-300 font-bold",
      };

    if (progress > 0)
      return {
        label: "In Progress",
        cls: "bg-yellow-100 text-yellow-800 border border-yellow-300 font-bold",
      };

    return {
      label: "Not Started",
      cls: "bg-gray-100 text-gray-700 border border-gray-300 font-bold",
    };
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD]">
      <Navbar isLoggedIn={true} />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 text-left">
          My Enrollments
        </h1>

        <p className="text-lg text-gray-600 mb-2 text-left font-semibold">
          Continue your courses and keep up with your progress.
        </p>

        <p className="text-sm text-slate-400 mb-6">
          {enrolledCourses.length}{" "}
          {enrolledCourses.length === 1 ? "course" : "courses"} enrolled
        </p>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No Enrollments Yet
            </h2>

            <p className="text-gray-600 mb-5">
              You are not enrolled in any courses yet. Start exploring courses
              and begin learning.
            </p>

            <Link
              to="/courses"
              className="inline-block py-2 px-6 rounded-lg text-white font-semibold shadow transition-colors duration-300 hover:shadow-lg"
              style={{ backgroundColor: "#1976D2" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1565C0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#1976D2")
              }
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
              const remaining = Math.round(
                course.duration * (1 - progress / 100)
              );
              const barColor = progress === 100 ? "#22C55E" : "#1976D2";
              const actionLabel =
                progress === 100
                  ? "Review"
                  : progress > 0
                  ? "Continue"
                  : "Start";

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-shadow duration-300 p-5 flex flex-col gap-4"
                >
                  {/* Instructor */}
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
                      className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${status.cls}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Category */}
                  <p className="text-sm text-gray-600">
                    Category: {course.category || "General"}
                  </p>

                  {/* Modules & Lessons */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <LayoutGrid className="w-4 h-4 text-[#1976D2] flex-shrink-0" />
                    <span>
                      {(() => {
                        const m = Array.isArray(course.modules)
                          ? course.modules.length
                          : 0;
                        return `${m} ${m === 1 ? "module" : "modules"}`;
                      })()}{" "}
                      · {lessons} {lessons === 1 ? "lesson" : "lessons"}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                    <span>{remaining} min left</span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span className="font-semibold" style={{ color: barColor }}>
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Continue */}
                  <div className="pt-1">
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-sm font-semibold text-[#0D47A1] hover:text-[#1976D2] transition"
                    >
                      {actionLabel} →
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
