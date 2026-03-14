import { Link } from "react-router-dom";

function Profile({ currentUser, courses = [], users = [] }) {
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F4F8FD] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md text-center">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">Profile Page</h1>
          <p className="text-gray-600 mb-5">
            Please login first to access your account.
          </p>
          <Link
            to="/login"
            className="inline-block rounded-lg bg-[#1976D2] px-4 py-2 text-white transition hover:bg-[#1565C0]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const isInstructor = currentUser.role === "instructor";

  const myEnrolledCourses = courses.filter((course) =>
    currentUser.enrolledCourses?.includes(course.id)
  );

  const myCreatedCourses = courses.filter(
    (course) => course.instructorId === currentUser.id
  );

  const displayedCourses = isInstructor ? myCreatedCourses : myEnrolledCourses;

  const findInstructorName = (id) => {
    const instructor = users.find((user) => user.id === id);
    return instructor ? instructor.name : "Unknown Instructor";
  };

  const countLessons = (course) => {
    if (!course.modules) return 0;
    return course.modules.reduce(
      (sum, module) => sum + (module.lessons ? module.lessons.length : 0),
      0
    );
  };

  const calculateProgress = (course) => {
    if (!course.modules || !currentUser.progress) return 0;

    let total = 0;
    let done = 0;

    course.modules.forEach((module) => {
      module.lessons?.forEach((lesson) => {
        total += 1;
        if (currentUser.progress[lesson.id]) done += 1;
      });
    });

    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  };

  const enrolledCount = myEnrolledCourses.length;
  const createdCount = myCreatedCourses.length;

  const finishedCourses = myEnrolledCourses.filter(
    (course) => calculateProgress(course) === 100
  ).length;

  const averageProgress =
    myEnrolledCourses.length > 0
      ? Math.round(
          myEnrolledCourses.reduce(
            (sum, course) => sum + calculateProgress(course),
            0
          ) / myEnrolledCourses.length
        )
      : 0;

  const totalModules = myCreatedCourses.reduce(
    (sum, course) => sum + (course.modules ? course.modules.length : 0),
    0
  );

  const totalLessons = myCreatedCourses.reduce(
    (sum, course) => sum + countLessons(course),
    0
  );

  return (
    <div className="min-h-screen bg-[#F4F8FD] py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">
            View your account information and course progress.
          </p>
        </div>

        <div className="mb-10 rounded-xl bg-white p-6 shadow-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1976D2] text-3xl font-bold text-white">
                {currentUser.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {currentUser.name}
                </h2>
                <p className="text-gray-600">{currentUser.email}</p>
                <span className="mt-2 inline-block rounded-full bg-[#FEF3C7] px-3 py-1 text-sm font-medium text-gray-800 capitalize">
                  {currentUser.role}
                </span>
              </div>
            </div>

            <Link
              to={isInstructor ? "/manage-courses" : "/courses"}
              className="rounded-lg border border-[#1976D2] px-4 py-2 text-[#1976D2] transition hover:bg-[#E3F2FD]"
            >
              {isInstructor ? "Open Course Manager" : "Explore Courses"}
            </Link>
          </div>
        </div>

        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isInstructor ? (
            <>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <p className="text-sm text-gray-500">Created Courses</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900">
                  {createdCount}
                </h3>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <p className="text-sm text-gray-500">Total Modules</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900">
                  {totalModules}
                </h3>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <p className="text-sm text-gray-500">Total Lessons</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900">
                  {totalLessons}
                </h3>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <p className="text-sm text-gray-500">Role</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 capitalize">
                  {currentUser.role}
                </h3>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <p className="text-sm text-gray-500">Enrolled Courses</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900">
                  {enrolledCount}
                </h3>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <p className="text-sm text-gray-500">Finished Courses</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900">
                  {finishedCourses}
                </h3>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <p className="text-sm text-gray-500">Average Progress</p>
                <h3 className="mt-2 text-3xl font-bold text-[#22C55E]">
                  {averageProgress}%
                </h3>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <p className="text-sm text-gray-500">Role</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 capitalize">
                  {currentUser.role}
                </h3>
              </div>
            </>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              Account Information
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Name:</span> {currentUser.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {currentUser.email}
              </p>
              <p>
                <span className="font-semibold">Role:</span>{" "}
                <span className="capitalize">{currentUser.role}</span>
              </p>
              <p>
                <span className="font-semibold">Courses:</span>{" "}
                {isInstructor ? createdCount : enrolledCount}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              {isInstructor ? "Instructor Summary" : "Course Progress"}
            </h2>
            <p className="mb-4 text-gray-600">
              {isInstructor
                ? `You have added ${createdCount} courses so far.`
                : `You have completed ${finishedCourses} courses so far.`}
            </p>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#22C55E]"
                style={{
                  width: `${
                    isInstructor
                      ? Math.min(createdCount * 20, 100)
                      : averageProgress
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            {isInstructor ? "My Created Courses" : "My Enrolled Courses"}
          </h2>

          {displayedCourses.length === 0 ? (
            <div className="rounded-xl bg-white p-6 shadow-md text-center">
              <p className="mb-4 text-gray-600">
                {isInstructor
                  ? "You have not created any courses yet."
                  : "You are not enrolled in any courses yet."}
              </p>
              <Link
                to={isInstructor ? "/manage-courses" : "/courses"}
                className="inline-block rounded-lg bg-[#1976D2] px-4 py-2 text-white transition hover:bg-[#1565C0]"
              >
                {isInstructor ? "Add New Course" : "Explore Courses"}
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {displayedCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="mb-4 h-40 w-full rounded-lg object-cover"
                  />

                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {course.title}
                  </h3>

                  <p className="mb-1 text-sm text-gray-600">
                    Instructor: {findInstructorName(course.instructorId)}
                  </p>

                  <p className="mb-1 text-sm text-gray-600">
                    Category: {course.category || "General"}
                  </p>

                  <p className="mb-3 text-sm text-gray-600">
                    {course.modules ? course.modules.length : 0} Modules •{" "}
                    {countLessons(course)} Lessons
                  </p>

                  {!isInstructor && (
                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{calculateProgress(course)}%</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-[#22C55E]"
                          style={{ width: `${calculateProgress(course)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={
                        isInstructor
                          ? `/manage-courses/${course.id}`
                          : `/courses/${course.id}`
                      }
                      className="rounded-lg bg-[#1976D2] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#1565C0]"
                    >
                      {isInstructor ? "Open Course" : "Continue"}
                    </Link>

                    <Link
                      to={`/courses/${course.id}`}
                      className="rounded-lg border border-[#1976D2] px-3 py-2 text-sm font-medium text-[#1976D2] transition hover:bg-[#E3F2FD]"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;