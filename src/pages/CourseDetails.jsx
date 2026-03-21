import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courses, users, modules } from "../data/mockdata.js";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "./AuthContext.jsx";
import {
  Check, RotateCcw, Clock, BarChart2, Users, Star,
  BookOpen, Bookmark, BookmarkCheck, Share2
} from "lucide-react";
import ModuleAccordion from "../components/ModuleAccordion.jsx";

export default function CourseDetails() {
  const { id }             = useParams();
  const navigate           = useNavigate();
  const { currentUser, login } = useAuth();

  const course = courses.find(c => c.id.toString() === id);

  const enrolledIds = Array.isArray(currentUser?.enrolledCourses)
    ? currentUser.enrolledCourses
    : [];

  const [enrolled, setEnrolled] = useState(() => enrolledIds.includes(course?.id));
  const [showPopup, setShowPopup] = useState(false);
  const [saved, setSaved]         = useState(false);
  const [copied, setCopied]       = useState(false);

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Course not found</h1>
          <Link to="/courses" className="text-blue-600 underline underline-offset-4 hover:opacity-75 transition-opacity">
            Back to Courses
          </Link>
        </main>
      </>
    );
  }

  const instructor    = users.find(u => u.id === course.instructorId);
  const courseModules = (course.modules || [])
    .map(mid => modules.find(m => m.id === mid))
    .filter(Boolean);

  const handleEnroll = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }
    if (enrolled) return;

    const updatedEnrolledCourses = [...enrolledIds, course.id];
    const updatedUser = { ...currentUser, enrolledCourses: updatedEnrolledCourses };
    login(updatedUser);

    setEnrolled(true);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3500);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: course.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {}
  };

  const stats = [
    { icon: Clock,     label: "Duration",   value: `${course.duration ?? "N/A"} min` },
    { icon: BarChart2, label: "Difficulty",  value: course.difficulty || "N/A" },
    { icon: Users,     label: "Students",    value: (course.studentsCount ?? 0).toLocaleString() },
    { icon: Star,      label: "Rating",      value: course.rating ?? "N/A" },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 w-full p-4 sm:p-6">

        {/* ── Top bar ── */}
        <div className="mb-5 max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/courses"
            aria-label="Back to courses list"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <RotateCcw size={15} aria-hidden="true" />
            Back to Courses
          </Link>

          <div className="flex items-center gap-1" role="toolbar" aria-label="Course actions">

            {/* Bookmark — blue bg, white icon */}
            <button
              onClick={() => setSaved(s => !s)}
              aria-label={saved ? "Remove from saved" : "Save this course"}
              aria-pressed={saved}
              className="p-2 rounded-lg hover:bg-gray-200 focus-visible:outline
                         focus-visible:outline-2 focus-visible:outline-blue-500 transition-colors duration-200"
              style={{ backgroundColor: "#1976D2" }}
            >
              {saved
                ? <BookmarkCheck size={18} className="text-white" aria-hidden="true" />
                : <Bookmark size={18} className="text-white" aria-hidden="true" />}
            </button>

            {/* Share — blue bg, white icon */}
            <button
              onClick={handleShare}
              aria-label="Share this course"
              className="p-2 rounded-lg hover:bg-gray-200 focus-visible:outline
                         focus-visible:outline-2 focus-visible:outline-blue-500 transition-colors duration-200"
              style={{ backgroundColor: "#1976D2" }}
            >
              <Share2 size={18} className="text-white" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-5">

          {/* ── Hero Card ── */}
          <article
            aria-label={`${course.title} course overview`}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200"
          >
            <div className="flex flex-col md:flex-row">

              {/* Image */}
              <div className="w-full md:w-2/5 flex-shrink-0">
                <img
                  src={course.image}
                  alt={`Cover image for ${course.title}`}
                  loading="lazy"
                  className="w-full h-56 sm:h-64 md:h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 p-5 sm:p-7 flex flex-col gap-4">

                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                  {instructor ? instructor.name : "Unknown Instructor"}
                </p>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug">
                  {course.title}
                </h1>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {course.description}
                </p>

              
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {stats.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100"
                    >
                      <div className="p-1.5 rounded-lg bg-blue-50 flex-shrink-0" aria-hidden="true">
                        <Icon size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <dt className="text-xs text-gray-400">{label}</dt>
                        <dd className="text-sm font-semibold text-gray-700 leading-tight">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>

                
                <button
                  onClick={handleEnroll}
                  disabled={enrolled}
                  aria-label={
                    !currentUser
                      ? "Log in to enroll in this course"
                      : enrolled
                      ? `Already enrolled in ${course.title}`
                      : `Enroll in ${course.title}`
                  }
                  className="mt-auto w-full py-3 rounded-xl text-white font-semibold text-sm shadow
                             transition-all duration-300 border-none
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                             focus-visible:outline-blue-500
                             disabled:cursor-not-allowed disabled:opacity-80"
                  style={{ backgroundColor: enrolled ? "#4caf50" : "#1976D2" }}
                  onMouseEnter={e => { if (!enrolled) e.currentTarget.style.backgroundColor = "#0094c5"; }}
                  onMouseLeave={e => { if (!enrolled) e.currentTarget.style.backgroundColor = "#1976D2"; }}
                >
                  {enrolled
                    ? "✓ Enrolled"
                    : currentUser
                    ? "Enroll Now"
                    : "Log in to Enroll"}
                </button>

                {enrolled && (
                  <Link
                    to="/enrollments"
                    className="text-center text-xs text-blue-600 hover:underline underline-offset-4 transition-colors"
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
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-7"
            >
              <header className="flex items-center gap-2.5 mb-5">
                <div className="p-2 rounded-lg bg-blue-50" aria-hidden="true">
                  <BookOpen size={16} className="text-blue-600" />
                </div>
                <div>
                  <h2 id="modules-heading" className="text-lg font-bold text-gray-800 leading-tight">
                    Course Modules
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {courseModules.length} module{courseModules.length !== 1 ? "s" : ""} included
                  </p>
                </div>
              </header>

              <ModuleAccordion modules={courseModules} />
            </section>
          )}
        </div>
      </div>

      
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {showPopup && `Successfully enrolled in ${course.title}`}
        {copied && "Link copied to clipboard"}
      </div>

  
      {showPopup && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                     bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg
                     flex items-center gap-2 text-sm font-medium"
        >
          <Check size={18} aria-hidden="true" />
          Successfully enrolled in &quot;{course.title}&quot;!
        </div>
      )}

      {/* Copy toast */}
      {copied && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                     bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg
                     flex items-center gap-2 text-sm font-medium"
        >
          <Check size={18} aria-hidden="true" />
          Link copied to clipboard!
        </div>
      )}
    </>
  );
}