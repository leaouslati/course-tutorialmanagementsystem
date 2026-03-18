import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function Enrollments({ currentUser, courses = [], users = [] }) {
  const isInstructor = currentUser?.role === "instructor";

  const enrolledCourses =
    currentUser && Array.isArray(currentUser.enrolledCourses)
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F8FD]">
        <Navbar isLoggedIn={false} />
        <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md border border-slate-200 text-center">
            <h1 className="text-3xl font-bold text-slate-900">My Enrollments</h1>
            <p className="mt-3 text-slate-600">
              Please log in first to view your enrolled courses.
            </p>
            <Link
              to="/login"
              className="mt-5 inline-block rounded-xl bg-[#1976D2] px-4 py-2.5 text-white font-semibold hover:bg-[#1565C0] transition"
            >
              Go to Login
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (isInstructor) {
    return (
      <div className="min-h-screen bg-[#F4F8FD]">
        <Navbar isLoggedIn={true} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200 text-center">
            <h1 className="text-4xl font-bold text-slate-900">My Enrollments</h1>
            <p className="mt-3 text-slate-600">
              This page is for student enrollments. As an instructor, you can manage your courses instead.
            </p>
            <Link
              to="/manage-courses"
              className="mt-5 inline-block rounded-xl bg-[#1976D2] px-4 py-2.5 text-white font-semibold hover:bg-[#1565C0] transition"
            >
              Go to Manage Courses
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8FD] text-slate-800">
      <Navbar isLoggedIn={true} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-2xl bg-white p-5 shadow-md border border-slate-200 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1976D2]">
            Student View
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">
            My Enrollments
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Track your enrolled courses, progress, and continue learning from where you stopped.
          </p>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
              Enrolled Courses
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {enrolledCourses.length}
            </p>
          </article>

          <article className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
              Completed Courses
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {completedCourses}
            </p>
          </article>

          <article className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
              Average Progress
            </p>
            <p className="mt-2 text-2xl font-bold text-[#22C55E]">
              {averageProgress}%
            </p>
          </article>

          <article className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
              Total Lessons
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {totalLessons}
            </p>
          </article>
        </section>

        {enrolledCourses.length === 0 ? (
          <section className="rounded-2xl bg-white p-6 shadow-md border border-slate-200 text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              No Enrollments Yet
            </h2>
            <p className="mt-2 text-slate-600">
              You are not enrolled in any course yet. Start exploring courses and begin your learning journey.
            </p>
            <Link
              to="/courses"
              className="mt-5 inline-block rounded-xl bg-[#1976D2] px-4 py-2.5 text-white font-semibold hover:bg-[#1565C0] transition"
            >
              Browse Courses
            </Link>
          </section>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {enrolledCourses.map((course) => {
              const progress = calculateProgress(course);
              const totalCourseLessons = countLessons(course);

              return (
                <article
                  key={course.id}
                  className="rounded-2xl bg-white p-4 shadow-md border border-slate-200 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-44 w-full rounded-xl object-cover"
                  />

                  <div className="mt-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-semibold text-slate-900">
                        {course.title}
                      </h2>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          progress === 100
                            ? "bg-green-100 text-green-700"
                            : "bg-[#FEF3C7] text-slate-700"
                        }`}
                      >
                        {progress === 100 ? "Completed" : "In Progress"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-600">
                      Instructor: {getInstructorName(course.instructorId)}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Category: {course.category || "General"}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {Array.isArray(course.modules) ? course.modules.length : 0} Modules •{" "}
                      {totalCourseLessons} Lessons
                    </p>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>Progress</span>
                        <span className="font-medium text-[#22C55E]">{progress}%</span>
                      </div>

                      <div className="h-2.5 w-full rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-[#22C55E]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        to={`/courses/${course.id}`}
                        className="rounded-xl bg-[#1976D2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1565C0]"
                      >
                        Continue Learning
                      </Link>

                      <Link
                        to={`/courses/${course.id}`}
                        className="text-sm font-medium text-[#0D47A1] transition hover:text-[#1976D2]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}

export default Enrollments;