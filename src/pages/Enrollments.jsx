import { Link, useNavigate } from "react-router-dom";
// ...removed Navbar import
import { courses, users, modules } from "../data/mockdata.js";
import { LayoutGrid, Clock, X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../pages/AuthContext";

// Shared button styles
const blueBtn = {
  base:         "rounded-xl py-2.5 text-sm font-semibold text-white transition",
  style:        { backgroundColor: '#1976D2' },
  onMouseEnter: (e) => { e.currentTarget.style.backgroundColor = '#2196F3'; },
  onMouseLeave: (e) => { e.currentTarget.style.backgroundColor = '#1976D2'; },
};
const redBtn = {
  base:         "rounded-xl py-2.5 text-sm font-semibold text-white transition",
  style:        { backgroundColor: '#EF4444' },
  onMouseEnter: (e) => { e.currentTarget.style.backgroundColor = '#DC2626'; },
  onMouseLeave: (e) => { e.currentTarget.style.backgroundColor = '#EF4444'; },
};

function Enrollments() {
  const { currentUser } = useAuth();

  const [enrolled, setEnrolled] = useState(
    Array.isArray(currentUser?.enrolledCourses) ? currentUser.enrolledCourses : []
  );
  const [confirmId, setConfirmId] = useState(null); // course id pending unenroll
  const navigate = useNavigate();

  const enrolledCourses = courses.filter((c) => enrolled.includes(c.id));

  const handleUnenroll = (courseId) => {
    const updated = enrolled.filter((id) => id !== courseId);
    setEnrolled(updated);
    currentUser.enrolledCourses = updated;
    setConfirmId(null);
  };

  const getInstructorName = (id) =>
    users.find((u) => u.id === id)?.name || "Unknown Instructor";

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

  const confirmCourse = courses.find((c) => c.id === confirmId);

  return (
    <div className="min-h-screen w-screen bg-[#F4F8FD]">


      {confirmId && confirmCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="unenroll-title"
        >
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
                <h3 id="unenroll-title" className="text-base font-bold text-slate-900">
                  Unenroll from course?
                </h3>
              </div>
              <button
                onClick={() => setConfirmId(null)}
                aria-label="Cancel"
                className="rounded-lg p-1.5 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4 text-slate-500" aria-hidden="true" />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-slate-600 leading-relaxed">
                Are you sure you want to unenroll from{" "}
                <span className="font-semibold text-slate-900">{confirmCourse.title}</span>?
                Your progress will be lost.
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnenroll(confirmId)}
                className={`flex-1 ${redBtn.base}`}
                style={redBtn.style}
                onMouseEnter={redBtn.onMouseEnter}
                onMouseLeave={redBtn.onMouseLeave}
              >
                Yes, unenroll
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <header className="mb-6 sm:mb-8">
       <h1 className="font-bold text-gray-900 mb-2" style={{ fontSize: "clamp(2.35rem, 4vw, 2.25rem)" }}>
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
            <button
              onClick={() => navigate("/courses")}
              className={`${blueBtn.base} px-6 shadow`}
              style={blueBtn.style}
              onMouseEnter={blueBtn.onMouseEnter}
              onMouseLeave={blueBtn.onMouseLeave}
            >
              Browse Courses
            </button>
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
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-xs px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap ${status.cls}`}
                        aria-label={`Status: ${status.label}`}
                      >
                        {status.label}
                      </span>
                    </div>
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

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <Link
                      to={`/courses/${course.id}`}
                      aria-label={`${actionLabel} ${course.title}`}
                      className="text-sm font-semibold text-[#1976D2] hover:text-[#2196F3] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2 rounded"
                    >
                      {actionLabel} →
                    </Link>
                    <button
                      onClick={() => setConfirmId(course.id)}
                      aria-label={`Unenroll from ${course.title}`}
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
                    >
                      Unenroll
                    </button>
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
