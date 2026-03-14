import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function Profile({ currentUser, courses = [], users = [] }) {
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#F4F8FD] flex items-center justify-center px-3 py-8">
        <section className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-lg border border-slate-200">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1976D2]">Profile</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Please log in first</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">You need to sign in to view your dashboard, progress cards, and course details.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 w-full rounded-lg bg-[#1976D2] px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#1565C0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2"
          >
            Go to Login
          </button>
        </section>
      </main>
    );
  }

  const isInstructor = currentUser.role === "instructor";

  const enrolledCourses = Array.isArray(currentUser.enrolledCourses)
    ? courses.filter((course) => currentUser.enrolledCourses.includes(course.id))
    : [];

  const createdCourses = courses.filter((course) => course.instructorId === currentUser.id);
  const displayedCourses = isInstructor ? createdCourses : enrolledCourses;

  const getInstructorName = (id) => users.find((user) => user.id === id)?.name ?? "Unknown Instructor";

  const countCourseLessons = (course) =>
    Array.isArray(course.modules)
      ? course.modules.reduce(
          (acc, module) => acc + (Array.isArray(module.lessons) ? module.lessons.length : 0),
          0
        )
      : 0;

  const computeProgress = (course) => {
    if (!Array.isArray(course.modules) || !currentUser.progress) return 0;
    let total = 0;
    let done = 0;

    course.modules.forEach((module) => {
      Array.isArray(module.lessons) &&
        module.lessons.forEach((lesson) => {
          total += 1;
          if (currentUser.progress[lesson.id]) done += 1;
        });
    });

    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const enrolledCount = enrolledCourses.length;
  const createdCount = createdCourses.length;
  const finishedCourses = enrolledCourses.filter((course) => computeProgress(course) === 100).length;
  const averageProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, course) => sum + computeProgress(course), 0) / enrolledCourses.length
        )
      : 0;
  const totalModules = createdCourses.reduce((acc, course) => acc + (Array.isArray(course.modules) ? course.modules.length : 0), 0);
  const totalLessons = createdCourses.reduce((acc, course) => acc + countCourseLessons(course), 0);

  const summaryCards = isInstructor
    ? [
        { label: "Created Courses", value: createdCount },
        { label: "Total Modules", value: totalModules },
        { label: "Total Lessons", value: totalLessons },
        { label: "Role", value: currentUser.role },
      ]
    : [
        { label: "Enrolled Courses", value: enrolledCount },
        { label: "Finished Courses", value: finishedCourses },
        { label: "Average Progress", value: `${averageProgress}%`, extraClass: "text-[#16A34A]" },
        { label: "Role", value: currentUser.role },
      ];

  const progressValue = isInstructor ? Math.min(createdCount * 18, 100) : averageProgress;

  return (
    <div className="min-h-screen bg-[#F4F8FD] text-slate-800">
      <Navbar isLoggedIn={Boolean(currentUser)} />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-2xl bg-white p-4 sm:p-5 shadow-md border border-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1976D2]">Dashboard</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">My Profile</h1>
              <p className="mt-1 text-sm text-slate-600">Track your learning, progress, and course activity.</p>
            </div>
            <Link
              to={isInstructor ? "/manage-courses" : "/courses"}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#1976D2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1565C0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2 sm:w-auto"
            >
              {isInstructor ? "Manage Courses" : "Browse Courses"}
            </Link>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
          <article className="rounded-2xl bg-white p-4 sm:p-5 shadow-md border border-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1976D2] text-2xl font-bold text-white">
                  {currentUser.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">{currentUser.name}</p>
                  <p className="text-sm text-slate-600">{currentUser.email}</p>
                  <span className="mt-1 inline-flex rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-medium text-slate-700 capitalize">
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/profile"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-[#1976D2] hover:text-[#1976D2]"
                >
                  View Profile
                </Link>
                <Link
                  to={isInstructor ? "/manage-courses" : "/courses"}
                  className="rounded-lg bg-[#1976D2] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1565C0]"
                >
                  {isInstructor ? "Manage" : "Explore"}
                </Link>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-white p-4 sm:p-5 shadow-md border border-slate-200">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Overall Progress</p>
              <p className="text-xs font-medium text-slate-600">{progressValue}%</p>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#22C55E]"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progressValue}
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </article>
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className="rounded-xl bg-white p-4 shadow-sm border border-slate-200"
            >
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">{card.label}</p>
              <p className={`mt-2 text-2xl font-bold ${card.extraClass ?? "text-slate-900"}`}>{card.value}</p>
            </article>
          ))}
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
          <article className="rounded-2xl bg-white p-4 sm:p-5 shadow-md border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Account Information</h2>
            <dl className="mt-3 grid gap-2 text-sm text-slate-700">
              <div className="flex flex-wrap gap-2"><dt className="font-semibold">Name:</dt><dd>{currentUser.name}</dd></div>
              <div className="flex flex-wrap gap-2"><dt className="font-semibold">Email:</dt><dd>{currentUser.email}</dd></div>
              <div className="flex flex-wrap gap-2"><dt className="font-semibold">Role:</dt><dd className="capitalize">{currentUser.role}</dd></div>
            </dl>
          </article>

          <article className="rounded-2xl bg-white p-4 sm:p-5 shadow-md border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">{isInstructor ? "Instructor Summary" : "Learning Summary"}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {isInstructor
                ? `You created ${createdCount} ${createdCount === 1 ? "course" : "courses"}.`
                : `You completed ${finishedCourses} ${finishedCourses === 1 ? "course" : "courses"}.`}
            </p>
            <div className="mt-3 h-2.5 w-full rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#22C55E]"
                style={{ width: `${Math.max(0, Math.min(progressValue, 100))}%` }}
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.max(0, Math.min(progressValue, 100))}
              />
            </div>
          </article>
        </section>

        <section className="rounded-2xl bg-white p-4 sm:p-5 shadow-md border border-slate-200">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{isInstructor ? "My Created Courses" : "My Enrolled Courses"}</h2>
              <p className="text-sm text-slate-600">{isInstructor ? "Courses you created" : "Courses you are currently enrolled in"}</p>
            </div>
            <Link
              to={isInstructor ? "/manage-courses" : "/courses"}
              className="rounded-md bg-[#1976D2] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1565C0]"
            >
              {isInstructor ? "Create Course" : "Browse Courses"}
            </Link>
          </div>

          {displayedCourses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-slate-600">
              {isInstructor
                ? "No courses created yet. Start by adding your first course."
                : "No current enrollments. Explore courses to begin learning."}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {displayedCourses.map((course) => {
                const progress = computeProgress(course);
                const lessons = countCourseLessons(course);
                return (
                  <article key={course.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <img
                      src={course.image}
                      alt={`${course.title} cover`}
                      className="h-36 w-full rounded-lg object-cover"
                    />
                    <div className="mt-3 space-y-2">
                      <h3 className="text-base font-semibold text-slate-900">{course.title}</h3>
                      <p className="text-xs text-slate-500">Instructor: {getInstructorName(course.instructorId)}</p>
                      <p className="text-xs text-slate-500">Category: {course.category || "General"}</p>
                      <p className="text-xs text-slate-500">{Array.isArray(course.modules) ? course.modules.length : 0} modules · {lessons} lessons</p>
                      {!isInstructor && (
                        <div>
                          <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-[#22C55E]" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Link
                          to={isInstructor ? `/manage-courses/${course.id}` : `/courses/${course.id}`}
                          className="rounded-md bg-[#1976D2] px-2 py-1.5 text-xs font-medium text-white hover:bg-[#1565C0]"
                        >
                          {isInstructor ? "Open" : "Continue"}
                        </Link>
                        <Link
                          to={`/courses/${course.id}`}
                          className="rounded-md border border-[#1976D2] px-2 py-1.5 text-xs font-medium text-[#1976D2] hover:bg-[#E3F2FD]"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Profile;
