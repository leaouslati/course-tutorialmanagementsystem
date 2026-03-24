import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { useAuth } from "../pages/AuthContext";

/* ─── Video Modal ─────────────────────────────────────────────────────── */
const LessonModal = ({ lesson, moduleName, onClose }) => {
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
    const last  = focusable[focusable.length - 1];
    const trap  = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
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
        className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100">
          <div className="min-w-0">
            <p className="text-xs text-slate-400 mb-0.5">{moduleName}</p>
            <h2
              id="lesson-modal-title"
              className="text-sm font-bold text-slate-900 leading-snug break-words"
            >
              {lesson.title}
            </h2>
            {lesson.duration && (
              <p className="text-xs text-slate-400 mt-0.5">{lesson.duration}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close lesson"
            className="shrink-0 w-11 h-11 rounded-xl text-white cursor-pointer flex items-center justify-center transition focus:outline-none"
            style={{ backgroundColor: "#1976D2" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2196F3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
          >
            <span aria-hidden="true" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>✕</span>
          </button>
        </div>

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

        {lesson.content && (
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 leading-relaxed m-0">{lesson.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Status Circle ───────────────────────────────────────────────────── */
const StatusCircle = ({ completed, locked }) => (
  <span
    role="img"
    aria-label={completed ? "Completed" : locked ? "Locked" : "Not started"}
    className={[
      "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
      completed
        ? "border-green-500 bg-green-500"
        : locked
        ? "border-slate-300 bg-slate-100"
        : "border-[#1976D2] bg-white",
    ].join(" ")}
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

/* ─── Main Component ──────────────────────────────────────────────────── */
const ModuleAccordion = ({ modules = [], enrolled = false, courseId }) => {
  const { updateProgress } = useAuth();

  const [openModule,    setOpenModule]    = useState(null);
  const [activeLesson,  setActiveLesson]  = useState(null);
  const [activeModName, setActiveModName] = useState("");

  // Local completed set — just lesson ids e.g. { 'l1': true, 'l2': true }
  const [completed, setCompleted] = useState({});

  // Total lessons across all modules — needed for progress %
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);

  const isCompleted = (lessonId) => !!completed[lessonId];

  // Lesson is unlocked if it's the first one, or the previous one is completed
  const isUnlocked = (lessons, index) => {
    if (index === 0) return true;
    return isCompleted(lessons[index - 1].id);
  };

  const toggleModule = (id) => setOpenModule((prev) => (prev === id ? null : id));

  const openLesson = (lesson, moduleName) => {
    setActiveLesson(lesson);
    setActiveModName(moduleName);
  };

  const closeLesson = () => {
    if (activeLesson) {
      const updatedCompleted = { ...completed, [activeLesson.id]: true };
      setCompleted(updatedCompleted);

      // Sync progress % to user object in AuthContext → localStorage
      const doneLessons = Object.keys(updatedCompleted).length;
      updateProgress(courseId, doneLessons, totalLessons);
    }
    setActiveLesson(null);
  };

  if (modules.length === 0) {
    return (
      <p className="text-center text-slate-400 py-8 text-sm">
        No modules available for this course yet.
      </p>
    );
  }

  return (
    <>
      <section aria-label="Course modules" className="flex flex-col gap-2.5">
        {modules.map((module, index) => {
          const isOpen      = openModule === module.id;
          const lessonCount = module.lessons?.length ?? 0;
          const headingId   = `module-heading-${module.id}`;
          const panelId     = `module-panel-${module.id}`;

          return (
            <div
              key={module.id}
              className="rounded-[17px] p-[1.5px]"
              style={{ backgroundColor: "#bfdbfe" }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#F4F8FD" }}
              >
                <button
                  id={headingId}
                  onClick={() => toggleModule(module.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="accordion-btn w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 text-left cursor-pointer"
                  style={{
                    backgroundColor: "#F4F8FD",
                    outline: "none",
                    boxShadow: "none",
                    border: "none",
                    WebkitTapHighlightColor: "transparent",
                  }}
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
                      <div className="text-sm font-bold text-slate-900 break-words whitespace-normal leading-snug">
                        {module.title}
                      </div>
                      <p className="m-0 mt-0.5 text-xs text-blue-400">
                        {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                        {module.duration ? ` · ${module.duration}` : ""}
                      </p>
                    </div>
                  </div>

                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={[
                      "shrink-0 text-blue-400 transition-transform duration-300",
                      isOpen ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                </button>

                <ul
                  id={panelId}
                  role="list"
                  aria-labelledby={headingId}
                  className={[
                    "list-none m-0 px-3 sm:px-5 py-1.5 flex flex-col border-t border-blue-100 bg-white",
                    isOpen ? "block" : "hidden",
                  ].join(" ")}
                >
                  {module.lessons?.length > 0 ? (
                    module.lessons.map((lesson, lessonIndex) => {
                      const isDone   = isCompleted(lesson.id);
                      const unlocked = isUnlocked(module.lessons, lessonIndex);
                      const locked   = enrolled && !unlocked;

                      return (
                        <li
                          key={lesson.id}
                          className={[
                            "flex flex-wrap items-center gap-x-2.5 gap-y-2 py-2.5 border-b border-slate-50 last:border-b-0",
                            locked ? "opacity-50" : "",
                          ].join(" ")}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <StatusCircle completed={isDone} locked={locked} />
                            <span
                              className={[
                                "text-[15px] leading-snug transition-all duration-300 break-words",
                                isDone   ? "line-through text-slate-400"
                                : locked ? "text-slate-400"
                                : "text-slate-700",
                              ].join(" ")}
                            >
                              {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 ml-auto shrink-0">
                            {lesson.duration && (
                              <span
                                className={`text-xs ${isDone || locked ? "text-slate-300" : "text-slate-400"}`}
                                aria-label={`Duration: ${lesson.duration}`}
                              >
                                {lesson.duration}
                              </span>
                            )}

                            {lesson.free && !locked && (
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold px-2 py-0.5">
                                Free
                              </span>
                            )}

                            {enrolled && (
                              locked ? (
                                <span
                                  aria-label="Complete the previous lesson to unlock"
                                  className="min-h-[44px] w-11 flex items-center justify-center text-slate-400"
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
                                    (e.currentTarget.style.backgroundColor = isDone ? "#16a34a" : "#2196F3")
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
                    <li className="py-3 text-sm text-slate-400 italic">
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
        />
      )}
    </>
  );
};

export default ModuleAccordion;