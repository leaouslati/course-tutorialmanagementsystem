import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { API_URL, authFetch } from "../api.js";
import {
  Check,
  RotateCcw,
  Clock,
  Users,
  Star,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  GraduationCap,
  Layers,
  FileText,
  Tag,
} from "lucide-react";
import Button from "../components/Button";
import ModuleAccordion from "../components/ModuleAccordion.jsx";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const toastStyle = `
  @keyframes toastFade {
    0%   { opacity: 0; transform: translateX(-50%) translateY(8px); }
    12%  { opacity: 1; transform: translateX(-50%) translateY(0); }
    80%  { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(4px); }
  }
  .toast-animate {
    animation: toastFade 3.5s ease forwards;
  }
`;

export default function CourseDetails({ darkMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, toggleBookmark, isBookmarked } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [enrollError, setEnrollError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setFetchError("");

        const res = await authFetch(`${API_URL}/courses/${id}`);
        const data = await res.json();

        if (res.status === 404) {
          setNotFound(true);
          setCourse(null);
          return;
        }

        if (!res.ok) {
          throw new Error(data.message || "Failed to load course");
        }

        setCourse(data);
      } catch (error) {
        setFetchError(error.message || "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!currentUser || !id) {
        setEnrolled(false);
        setCheckingEnrollment(false);
        return;
      }

      try {
        setCheckingEnrollment(true);
        const res = await authFetch(`${API_URL}/enrollments/${id}/status`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to check enrollment");

        setEnrolled(data.enrolled);
      } catch (error) {
        console.error("checkEnrollment error:", error);
        setEnrolled(false);
      } finally {
        setCheckingEnrollment(false);
      }
    };

    checkEnrollment();
  }, [currentUser, id]);

  useEffect(() => {
    if (!showPopup) return;

    const timer = setTimeout(() => setShowPopup(false), 3500);
    return () => clearTimeout(timer);
  }, [showPopup]);

  const pageBg = darkMode ? "#060f1e" : "#F4F8FD";
  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder = darkMode ? "#1a3a6b" : "#e5e7eb";
  const statTileBg = darkMode ? "#0a1628" : "#F4F8FD";
  const statBorder = darkMode ? "#1a3a6b" : "#f1f5f9";
  const headingCol = darkMode ? "#f1f5f9" : "#111827";
  const subCol = darkMode ? "#94a3b8" : "#6b7280";
  const bodyText = darkMode ? "#cbd5e1" : "#4b5563";
  const divider = darkMode ? "#1a3a6b" : "#f1f5f9";
  const backLink = darkMode ? "#94a3b8" : "#6b7280";
  const iconTileBg = darkMode ? "rgba(25,118,210,0.15)" : "#E3F2FD";

  if (loading) return <LoadingSpinner darkMode={darkMode} message="Loading course..." fullPage />;

  if (notFound) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-6 transition-colors duration-300"
        style={{ backgroundColor: pageBg }}
      >
        <h1
          className="font-bold mb-3 text-center"
          style={{
            fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
            color: darkMode ? "#f1f5f9" : "#111827",
          }}
        >
          Course not found
        </h1>
        <Link
          to="/courses"
          className="text-sm font-medium text-[#1976D2] underline underline-offset-4 hover:opacity-75 transition-opacity"
        >
          Back to Courses
        </Link>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: pageBg }}>
        <ErrorMessage message={fetchError} darkMode={darkMode} />
        <Link to="/courses" className="text-sm font-medium text-[#1976D2] underline underline-offset-4 hover:opacity-75 transition-opacity">
          Back to Courses
        </Link>
      </main>
    );
  }

  if (!course) return null;

  const saved = currentUser ? isBookmarked(course.id) : false;

  const courseModules = Array.isArray(course.modules) ? course.modules : [];
  const totalLessons = courseModules.reduce(
    (sum, module) => sum + (Array.isArray(module.lessons) ? module.lessons.length : 0),
    0
  );
  const totalModules = courseModules.length;

  const instructorName =
    course.instructor?.name ||
    course.instructor_name ||
    course.instructorName ||
    "Unknown Instructor";

  const handleEnroll = async () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    if (enrolled || enrolling) return;

    try {
      setEnrolling(true);
      setEnrollError("");

      const res = await authFetch(`${API_URL}/enrollments`, {
        method: "POST",
        body: JSON.stringify({ courseId: course.id }),
      });

      if (res.status === 409) {
        setEnrolled(true);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to enroll");
      }

      setEnrolled(true);
      setShowPopup(true);
    } catch (error) {
      console.error("handleEnroll error:", error);
      setEnrollError(error.message || "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  const detailStats = [
    { icon: <Layers className="w-4 h-4 text-[#1976D2]" />, label: "Modules", value: totalModules },
    { icon: <FileText className="w-4 h-4 text-[#1976D2]" />, label: "Lessons", value: totalLessons },
    { icon: <Tag className="w-4 h-4 text-[#1976D2]" />, label: "Category", value: course.category || "General" },
    { icon: <GraduationCap className="w-4 h-4 text-[#1976D2]" />, label: "Level", value: course.difficulty },
  ];

  return (
    <>
      <style>{toastStyle}</style>

      <main
        className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6 pb-12 transition-colors duration-300"
        style={{ backgroundColor: pageBg }}
      >
        <div className="mb-4 max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80"
            style={{ color: backLink }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span>Back to Courses</span>
          </Link>

          {currentUser && (
            <button
              onClick={() => toggleBookmark(course.id)}
              aria-label={saved ? "Remove bookmark" : "Bookmark this course"}
              aria-pressed={saved}
              className="p-2 rounded-xl transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              style={{ backgroundColor: saved ? "#0f9f5a" : "#1976D2" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = saved
                  ? "#0b8a4e"
                  : darkMode
                  ? "#1565C0"
                  : "#2196F3")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = saved ? "#0f9f5a" : "#1976D2")
              }
              title={saved ? "Remove bookmark" : "Save course"}
            >
              {saved ? (
                <BookmarkCheck size={17} className="text-white" aria-hidden="true" />
              ) : (
                <Bookmark size={17} className="text-white" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          <article
            aria-labelledby="course-title"
            className="rounded-2xl shadow-sm overflow-hidden mb-8 transition-colors duration-300"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
            }}
          >
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/5 flex-shrink-0 md:min-h-[22rem]">
                <img
                  src={course.image}
                  alt={`Cover image for ${course.title}`}
                  loading="lazy"
                  className="w-full h-52 sm:h-64 md:h-full object-cover"
                />
              </div>

              <div className="flex-1 p-5 sm:p-7 flex flex-col gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#1976D2] mb-1">
                    {instructorName}
                  </p>
                  <h1
                    id="course-title"
                    className="font-bold leading-snug"
                    style={{
                      fontSize: "clamp(1.2rem, 3vw, 1.75rem)",
                      color: headingCol,
                    }}
                  >
                    {course.title}
                  </h1>
                </div>

                <p
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: bodyText }}
                >
                  {course.description || course.shortDescription}
                </p>

                <dl className="grid grid-cols-2 gap-2 sm:gap-3">
                  {detailStats.map(({ icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl transition-colors duration-300"
                      style={{
                        backgroundColor: statTileBg,
                        border: `1px solid ${statBorder}`,
                      }}
                    >
                      <span aria-hidden="true" className="flex-shrink-0">
                        {icon}
                      </span>
                      <div className="min-w-0">
                        <dt
                          className="text-[10px] uppercase tracking-wider truncate"
                          style={{ color: subCol }}
                        >
                          {label}
                        </dt>
                        <dd
                          className="text-xs sm:text-sm font-semibold leading-tight truncate"
                          style={{ color: headingCol }}
                        >
                          {value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <div
                  className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs border-t pt-3 transition-colors duration-300"
                  style={{ color: subCol, borderColor: divider }}
                  aria-label="Course statistics"
                >
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                    <span>{course.rating ?? 0} rating</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#1976D2]" aria-hidden="true" />
                    <span>{(course.studentsCount ?? 0).toLocaleString()} students</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#1976D2]" aria-hidden="true" />
                    <span>{course.duration ?? 0} min</span>
                  </span>
                </div>

                <Button
                  variant={enrolled ? "success" : "primary"}
                  size="lg"
                  darkMode={darkMode}
                  onClick={handleEnroll}
                  disabled={enrolled || enrolling || checkingEnrollment}
                  fullWidth
                  className="mt-auto shadow disabled:opacity-80 disabled:cursor-not-allowed"
                  aria-label={
                    !currentUser
                      ? "Log in to enroll in this course"
                      : enrolled
                      ? `Already enrolled in ${course.title}`
                      : `Enroll in ${course.title}`
                  }
                >
                  {checkingEnrollment
                    ? "Checking enrollment..."
                    : enrolled
                    ? "✓ Already Enrolled"
                    : enrolling
                    ? "Enrolling..."
                    : currentUser
                    ? "Enroll Now"
                    : "Log in to Enroll"}
                </Button>

                {enrollError && (
                  <p className="text-xs text-red-500 text-center -mt-2">{enrollError}</p>
                )}

                {enrolled && (
                  <Link
                    to="/enrollments"
                    className="text-center text-xs font-medium text-[#1976D2] hover:underline underline-offset-4 transition-colors -mt-2"
                  >
                    View in My Enrollments →
                  </Link>
                )}
              </div>
            </div>
          </article>

          {courseModules.length > 0 && (
            <section
              aria-labelledby="modules-heading"
              className="rounded-2xl shadow-sm p-5 sm:p-7 mb-8 transition-colors duration-300"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
              }}
            >
              <header className="flex items-center gap-3 mb-5 sm:mb-6">
                <div
                  className="p-2.5 rounded-xl flex-shrink-0 transition-colors duration-300"
                  style={{ backgroundColor: iconTileBg }}
                  aria-hidden="true"
                >
                  <BookOpen size={20} className="text-[#1976D2]" />
                </div>
                <div>
                  <h2
                    id="modules-heading"
                    className="font-bold"
                    style={{
                      fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
                      color: headingCol,
                    }}
                  >
                    Course Modules
                  </h2>
                  <p
                    className="text-xs sm:text-sm mt-0.5"
                    style={{ color: subCol }}
                  >
                    {totalModules} module{totalModules !== 1 ? "s" : ""} · {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
                  </p>
                </div>
              </header>

              <ModuleAccordion
                modules={courseModules}
                enrolled={enrolled}
                courseId={course.id}
                darkMode={darkMode}
              />
            </section>
          )}
        </div>
      </main>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {showPopup && `Successfully enrolled in ${course.title}`}
      </div>

      {showPopup && (
        <div
          role="status"
          className="toast-animate fixed bottom-6 left-1/2 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium text-center max-w-[90vw]"
        >
          <Check size={18} aria-hidden="true" className="flex-shrink-0" />
          <span>Successfully enrolled in &quot;{course.title}&quot;!</span>
        </div>
      )}
    </>
  );
}