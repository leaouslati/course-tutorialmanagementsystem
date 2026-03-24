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

export default function CourseDetails() {
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
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#F4F8FD] dark:bg-slate-900 px-4 py-6">
        <h1
          className="font-bold text-gray-900 dark:text-white mb-3 text-center"
          style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}
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
          type: l.videoUrl ? 'video' : 'text',
          duration: l.duration + ' min',
          url: l.videoUrl
            ?.replace('watch?v=', 'embed/'),
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

  return (
    <>
      <style>{toastStyle}</style>

      <main className="min-h-screen bg-[#F4F8FD] dark:bg-slate-900 w-full px-4 sm:px-6 lg:px-8 py-6 pb-12 transition-colors duration-300">

        {/* ── Top bar ── */}
        <div className="mb-4 max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <RotateCcw size={15} aria-hidden="true" />
            <span>Back to Courses</span>
          </Link>

          <button
            onClick={() => setSaved(s => !s)}
            aria-label={saved ? "Remove from saved" : "Save this course"}
            aria-pressed={saved}
            className="p-2 rounded-xl transition-colors duration-200
                       focus-visible:outline focus-visible:outline-2
                       focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            style={{ backgroundColor: "#1976D2" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2196F3"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1976D2"}
          >
            {saved
              ? <BookmarkCheck size={17} className="text-white" aria-hidden="true" />
              : <Bookmark      size={17} className="text-white" aria-hidden="true" />}
          </button>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">

          {/* ── Single unified card ── */}
          <article
            aria-labelledby="course-title"
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700 mb-8 transition-colors duration-300"
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

              {/* Info */}
              <div className="flex-1 p-5 sm:p-7 flex flex-col gap-4">

                {/* Instructor + title */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#1976D2] mb-1">
                    {instructor ? instructor.name : "Unknown Instructor"}
                  </p>
                  <h1
                    id="course-title"
                    className="font-bold text-gray-900 dark:text-white leading-snug"
                    style={{ fontSize: "clamp(1.2rem, 3vw, 1.75rem)" }}
                  >
                    {course.title}
                  </h1>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 leading-relaxed">
                  {course.description || course.shortDescription}
                </p>

                {/* Detail stats */}
                <dl className="grid grid-cols-2 gap-2 sm:gap-3">
                  {detailStats.map(({ icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-[#F4F8FD] dark:bg-slate-700 border border-slate-100 dark:border-slate-600"
                    >
                      <span aria-hidden="true" className="flex-shrink-0">{icon}</span>
                      <div className="min-w-0">
                        <dt className="text-[10px] text-gray-400 dark:text-slate-400 uppercase tracking-wider truncate">{label}</dt>
                        <dd className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-slate-100 leading-tight truncate">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>

                {/* Quick numbers */}
                <div
                  className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-600 pt-3"
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
                  className="mt-auto w-full py-3 rounded-xl text-white font-semibold text-sm shadow
                             transition-all duration-300
                             focus-visible:outline focus-visible:outline-2
                             focus-visible:outline-offset-2 focus-visible:outline-blue-500
                             disabled:cursor-not-allowed disabled:opacity-80"
                  style={{ backgroundColor: enrolled ? "#22c55e" : "#1976D2" }}
                  onMouseEnter={e => { if (!enrolled) e.currentTarget.style.backgroundColor = "#2196F3"; }}
                  onMouseLeave={e => { if (!enrolled) e.currentTarget.style.backgroundColor = "#1976D2"; }}
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

          {/* ── Modules ── */}
          {courseModules.length > 0 && (
            <section
              aria-labelledby="modules-heading"
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 sm:p-7 mb-8 transition-colors duration-300"
            >
              <header className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="p-2.5 rounded-xl bg-[#E3F2FD] dark:bg-blue-900/40 flex-shrink-0" aria-hidden="true">
                  <BookOpen size={20} className="text-[#1976D2]" />
                </div>
                <div>
                  <h2
                    id="modules-heading"
                    className="font-bold text-gray-900 dark:text-white"
                    style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)" }}
                  >
                    Course Modules
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 dark:text-slate-400 mt-0.5">
                    {totalModules} module{totalModules !== 1 ? "s" : ""} · {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
                  </p>
                </div>
              </header>
              <ModuleAccordion modules={courseModules} enrolled={enrolled} courseId={course.id} />
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
          className="toast-animate fixed bottom-6 left-1/2 z-50 bg-green-600 text-white
                     px-5 py-3 rounded-xl shadow-lg flex items-center gap-2
                     text-sm font-medium text-center max-w-[90vw]"
        >
          <Check size={18} aria-hidden="true" className="flex-shrink-0" />
          <span>Successfully enrolled in &quot;{course.title}&quot;!</span>
        </div>
      )}
    </>
  );
}