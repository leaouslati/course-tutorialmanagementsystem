import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { useAuth } from "../pages/AuthContext";
import { authFetch, API_URL } from '../api';

const LessonModal = ({ lesson, moduleName, onClose, darkMode }) => {
  const embedUrl = lesson.url || lesson.videoUrl?.replace("watch?v=", "embed/");
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    };
    el.addEventListener("keydown", trap);
    first?.focus();
    return () => el.removeEventListener("keydown", trap);
  }, []);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm bg-black/55"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-modal-title"
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: darkMode ? "#0f1f3d" : "#ffffff",
          border: `1px solid ${darkMode ? "#1a3a6b" : "#e2e8f0"}`,
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-start justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b"
          style={{ borderColor: darkMode ? "#1a3a6b" : "#f1f5f9" }}
        >
          <div className="min-w-0">
            <p className="text-xs mb-0.5" style={{ color: darkMode ? "#94a3b8" : "#94a3b8" }}>
              {moduleName}
            </p>
            <h2
              id="lesson-modal-title"
              className="text-sm font-bold leading-snug break-words"
              style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}
            >
              {lesson.title}
            </h2>
            {lesson.duration && (
              <p className="text-xs mt-0.5" style={{ color: darkMode ? "#94a3b8" : "#94a3b8" }}>
                {lesson.duration}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close lesson"
            className="shrink-0 w-11 h-11 rounded-xl text-white cursor-pointer flex items-center justify-center transition focus:outline-none"
            style={{ backgroundColor: "#1976D2" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
          >
            <span aria-hidden="true" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>✕</span>
          </button>
        </div>

        {/* Video */}
        <div className="w-full bg-slate-900 aspect-video">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 block"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
              No video available
            </div>
          )}
        </div>

        {/* Lesson Content */}
        {lesson.content && (
          <div
            className="px-4 sm:px-5 py-3 sm:py-4 border-t"
            style={{ borderColor: darkMode ? "#1a3a6b" : "#f1f5f9" }}
          >
            <p
              className="text-sm leading-relaxed m-0"
              style={{ color: darkMode ? "#cbd5e1" : "#64748b" }}
            >
              {lesson.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatusCircle = ({ completed, locked, darkMode }) => (
  <span
    role="img"
    aria-label={completed ? "Completed" : locked ? "Locked" : "Not started"}
    className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300"
    style={{
      borderColor: completed ? "#22c55e" : locked ? "#cbd5e1" : "#1976D2",
      backgroundColor: completed
        ? "#22c55e"
        : locked
          ? darkMode ? "#1a3a6b" : "#f1f5f9"
          : darkMode ? "#0f1f3d" : "#ffffff",
    }}
  >
    {completed && (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <polyline
          points="1.5,5 4,7.5 8.5,2.5"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </span>
);

const ModuleAccordion = ({ modules = [], enrolled = false, courseId, darkMode = false }) => {
  const { updateProgress } = useAuth();

  const [openModule, setOpenModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeModName, setActiveModName] = useState("");
  const [completed, setCompleted] = useState({});

  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
  const isCompleted = (lessonId) => !!completed[lessonId];
  const isUnlocked = (lessons, index) => index === 0 || isCompleted(lessons[index - 1].id);
  const toggleModule = (id) => setOpenModule((prev) => (prev === id ? null : id));

  const openLesson = (lesson, moduleName) => {
    setActiveLesson(lesson);
    setActiveModName(moduleName);
  };

 const closeLesson = async () => {
    if (activeLesson) {
      const updatedCompleted = { ...completed, [activeLesson.id]: true };
      setCompleted(updatedCompleted);
      const doneLessons = Object.keys(updatedCompleted).length;
      updateProgress(courseId, doneLessons, totalLessons);

      // Save progress to API
      const newProgress = Math.round((doneLessons / totalLessons) * 100);
      try {
          await authFetch(`${API_URL}/enrollments/${courseId}/progress`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ progress: newProgress }),
        });
      } catch (err) {
        console.error('Failed to save progress:', err);
      }
    }
    setActiveLesson(null);
  };

  if (modules.length === 0) {
    return (
      <p
        className="text-center py-8 text-sm"
        style={{ color: darkMode ? "#94a3b8" : "#94a3b8" }}
      >
        No modules available for this course yet.
      </p>
    );
  }

  const wrapperBorder = darkMode ? "#1a3a6b" : "#bfdbfe";
  const accordionBg = darkMode ? "#192e55" : "#F4F8FD";
  const lessonListBg = darkMode ? "#0a1628" : "#ffffff";
  const lessonBorder = darkMode ? "#1a3a6b" : "#f1f5f9";
  const listTopBorder = darkMode ? "#1a3a6b" : "#dbeafe";
  const moduleTitle = darkMode ? "#f1f5f9" : "#0f172a";
  const lessonText = darkMode ? "#cbd5e1" : "#334155";
  const mutedText = darkMode ? "#94a3b8" : "#94a3b8";

  return (
    <>
      <section aria-label="Course modules" className="flex flex-col gap-2.5">
        {modules.map((module, index) => {
          const isOpen = openModule === module.id;
          const lessonCount = module.lessons?.length ?? 0;
          const headingId = `module-heading-${module.id}`;
          const panelId = `module-panel-${module.id}`;

          return (
            <div
              key={module.id}
              className="rounded-[17px] p-[1.5px]"
              style={{ backgroundColor: wrapperBorder }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: accordionBg }}
              >
                {/* ── Accordion Header ── */}
                <button
                  id={headingId}
                  onClick={() => toggleModule(module.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 text-left cursor-pointer border-none outline-none focus:outline-none"
                  style={{ backgroundColor: accordionBg }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      aria-hidden="true"
                      className="shrink-0 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                      style={{ backgroundColor: "#1976D2" }}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div
                        className="text-sm font-bold break-words whitespace-normal leading-snug"
                        style={{ color: moduleTitle }}
                      >
                        {module.title}
                      </div>
                      <p
                        className="m-0 mt-0.5 text-xs"
                        style={{ color: darkMode ? "#60a5fa" : "#3b82f6" }}
                      >
                        {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                        {module.duration ? ` · ${module.duration}` : ""}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    style={{ color: darkMode ? "#60a5fa" : "#3b82f6" }}
                  />
                </button>

                {/* ── Lessons List ── */}
                <ul
                  id={panelId}
                  role="list"
                  aria-labelledby={headingId}
                  className={`list-none m-0 px-3 sm:px-5 py-1.5 flex flex-col border-t ${isOpen ? "block" : "hidden"}`}
                  style={{
                    backgroundColor: lessonListBg,
                    borderColor: listTopBorder,
                  }}
                >
                  {module.lessons?.length > 0 ? (
                    module.lessons.map((lesson, lessonIndex) => {
                      const isDone = isCompleted(lesson.id);
                      const unlocked = isUnlocked(module.lessons, lessonIndex);
                      const locked = enrolled && !unlocked;

                      return (
                        <li
                          key={lesson.id}
                          className={`flex flex-wrap items-center gap-x-2.5 gap-y-2 py-2.5 border-b last:border-b-0 ${locked ? "opacity-50" : ""}`}
                          style={{ borderColor: lessonBorder }}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <StatusCircle completed={isDone} locked={locked} darkMode={darkMode} />
                            <span
                              className="text-[15px] leading-snug transition-all duration-300 break-words"
                              style={{
                                color: isDone
                                  ? "#94a3b8"
                                  : locked
                                    ? "#94a3b8"
                                    : lessonText,
                                textDecoration: isDone ? "line-through" : "none",
                              }}
                            >
                              {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 ml-auto shrink-0">
                            {lesson.duration && (
                              <span
                                className="text-xs"
                                style={{ color: mutedText }}
                                aria-label={`Duration: ${lesson.duration}`}
                              >
                                {lesson.duration}
                              </span>
                            )}

                            {lesson.free && !locked && (
                              <span
                                className="rounded-full text-xs font-semibold px-2 py-0.5"
                                style={{
                                  backgroundColor: darkMode ? "rgba(16,185,129,0.15)" : "#ecfdf5",
                                  border: `1px solid ${darkMode ? "#065f46" : "#a7f3d0"}`,
                                  color: darkMode ? "#34d399" : "#059669",
                                }}
                              >
                                Free
                              </span>
                            )}

                            {enrolled && (
                              locked ? (
                                <span
                                  aria-label="Complete the previous lesson to unlock"
                                  className="min-h-[44px] w-11 flex items-center justify-center"
                                  style={{ color: mutedText }}
                                >
                                  <Lock size={15} aria-hidden="true" />
                                </span>
                              ) : (
                                <button
                                  onClick={() => openLesson(lesson, module.title)}
                                  aria-label={`${isDone ? "Rewatch" : "Start"} lesson: ${lesson.title}`}
                                  className="min-h-[44px] px-3 sm:px-4 text-xs sm:text-sm font-medium text-white rounded-lg shadow transition focus:outline-none whitespace-nowrap"
                                  style={{ backgroundColor: isDone ? "#22c55e" : "#1976D2" }}
                                  onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor = isDone
                                    ? "#16a34a"
                                    : darkMode ? "#1565C0" : "#2196F3")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor = isDone ? "#22c55e" : "#1976D2")
                                  }
                                >
                                  {isDone ? "Rewatch" : "Start"}
                                </button>
                              )
                            )}
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <li
                      className="py-3 text-sm italic"
                      style={{ color: mutedText }}
                    >
                      No lessons in this module yet.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          );
        })}
      </section>

      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          moduleName={activeModName}
          onClose={closeLesson}
          darkMode={darkMode}
        />
      )}
    </>
  );
};

export default ModuleAccordion;