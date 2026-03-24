import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courses, users, modules, lessons } from "../data/mockdata.js";
import { useAuth } from "./AuthContext.jsx";
import {
  Check, RotateCcw, Clock, Users, Star,
  BookOpen, Bookmark, BookmarkCheck,
  GraduationCap, Layers, FileText, Tag
} from "lucide-react";
import ModuleAccordion from "../components/ModuleAccordion.jsx";

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
  const { id }         = useParams();
  const navigate       = useNavigate();
  const { currentUser, login } = useAuth();

  const course = courses.find(c => c.id.toString() === id);

  const enrolledIds = Array.isArray(currentUser?.enrolledCourses)
    ? currentUser.enrolledCourses : [];

  const [enrolled,  setEnrolled]  = useState(() => enrolledIds.includes(course?.id));
  const [showPopup, setShowPopup] = useState(false);
  const [saved,     setSaved]     = useState(false);

  if (!course) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-6 transition-colors duration-300"
        style={{ backgroundColor: darkMode ? "#060f1e" : "#F4F8FD" }}
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

  const instructor    = users.find(u => u.id === course.instructorId);
  const courseModules = (course.modules || [])
    .map(mid => {
      const mod = modules.find(m => m.id === mid);
      if (!mod) return null;
      return {
        ...mod,
        lessons: (mod.lessons || []).map(lid => {
          const l = lessons.find(l => l.id === lid);
          if (!l) return null;
          return {
            ...l,
            type: l.videoUrl ? "video" : "text",
            duration: l.duration + " min",
            url: l.videoUrl?.replace("watch?v=", "embed/"),
          };
        }).filter(Boolean),
      };
    })
    .filter(Boolean);

  const totalLessons = courseModules.reduce((a, m) => a + (m?.lessons?.length || 0), 0);
  const totalModules = courseModules.length;

  const handleEnroll = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }
    if (enrolled) return;
    const updatedUser = { ...currentUser, enrolledCourses: [...enrolledIds, course.id] };
    login(updatedUser);
    setEnrolled(true);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3500);
  };

  const detailStats = [
    { icon: <Layers        className="w-4 h-4 text-[#1976D2]" />, label: "Modules",  value: totalModules },
    { icon: <FileText      className="w-4 h-4 text-[#1976D2]" />, label: "Lessons",  value: totalLessons },
    { icon: <Tag           className="w-4 h-4 text-[#1976D2]" />, label: "Category", value: course.category || "General" },
    { icon: <GraduationCap className="w-4 h-4 text-[#1976D2]" />, label: "Level",    value: course.difficulty },
  ];

  // ── shared color tokens (match CourseCard dark palette) ──────────────────
  const pageBg    = darkMode ? "#060f1e"  : "#F4F8FD";
  const cardBg    = darkMode ? "#0f1f3d"  : "#ffffff";
  const cardBorder= darkMode ? "#1a3a6b"  : "#e5e7eb";
  const statTileBg= darkMode ? "#0a1628"  : "#F4F8FD";
  const statBorder= darkMode ? "#1a3a6b"  : "#f1f5f9";
  const headingCol= darkMode ? "#f1f5f9"  : "#111827";
  const subCol    = darkMode ? "#94a3b8"  : "#6b7280";
  const bodyText  = darkMode ? "#cbd5e1"  : "#4b5563";
  const divider   = darkMode ? "#1a3a6b"  : "#f1f5f9";
  const backLink  = darkMode ? "#94a3b8"  : "#6b7280";
  const iconTileBg= darkMode ? "rgba(25,118,210,0.15)" : "#E3F2FD";

  return (
    <>
      <style>{toastStyle}</style>

      <main
        className="min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6 pb-12 transition-colors duration-300"
        style={{ backgroundColor: pageBg }}
      >

        {/* ── Top bar: back + save ── */}
        <div className="mb-4 max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:opacity-80"
            style={{ color: backLink }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span>Back to Courses</span>
          </Link>

          <button
            onClick={() => setSaved(s => !s)}
            aria-label={saved ? "Remove from saved" : "Save this course"}
            aria-pressed={saved}
            className="p-2 rounded-xl transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            style={{ backgroundColor: "#1976D2" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}
          >
            {saved
              ? <BookmarkCheck size={17} className="text-white" aria-hidden="true" />
              : <Bookmark      size={17} className="text-white" aria-hidden="true" />}
          </button>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">

          {/* ── Course Hero Card ── */}
          <article
            aria-labelledby="course-title"
            className="rounded-2xl shadow-sm overflow-hidden mb-8 transition-colors duration-300"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
            }}
          >
            <div className="flex flex-col md:flex-row">

              {/* Thumbnail */}
              <div className="w-full md:w-2/5 flex-shrink-0 md:min-h-[22rem]">
                <img
                  src={course.image}
                  alt={`Cover image for ${course.title}`}
                  loading="lazy"
                  className="w-full h-52 sm:h-64 md:h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-5 sm:p-7 flex flex-col gap-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#1976D2] mb-1">
                    {instructor ? instructor.name : "Unknown Instructor"}
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

                {/* Detail stats grid */}
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
                      <span aria-hidden="true" className="flex-shrink-0">{icon}</span>
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

                {/* Stats row */}
                <div
                  className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs border-t pt-3 transition-colors duration-300"
                  style={{ color: subCol, borderColor: divider }}
                  aria-label="Course statistics"
                >
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                    <span>{course.rating} rating</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#1976D2]" aria-hidden="true" />
                    <span>{(course.studentsCount ?? 0).toLocaleString()} students</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#1976D2]" aria-hidden="true" />
                    <span>{course.duration} min</span>
                  </span>
                </div>

                {/* Enroll button */}
                <button
                  onClick={handleEnroll}
                  disabled={enrolled}
                  aria-label={
                    !currentUser ? "Log in to enroll in this course"
                    : enrolled    ? `Already enrolled in ${course.title}`
                    : `Enroll in ${course.title}`
                  }
                  className="mt-auto w-full py-3 rounded-xl text-white font-semibold text-sm shadow transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-80"
                  style={{ backgroundColor: enrolled ? "#22c55e" : "#1976D2" }}
                  onMouseEnter={e => { if (!enrolled) e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3"; }}
                  onMouseLeave={e => { if (!enrolled) e.currentTarget.style.backgroundColor = enrolled ? "#22c55e" : "#1976D2"; }}
                >
                  {enrolled ? "✓ Enrolled" : currentUser ? "Enroll Now" : "Log in to Enroll"}
                </button>

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

          {/* ── Modules Section ── */}
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

      {/* ── Screen-reader live region ── */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {showPopup && `Successfully enrolled in ${course.title}`}
      </div>

      {/* ── Toast ── */}
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