import React, { useState } from "react";
import { ChevronDown, PlayCircle, FileText, CheckCircle } from "lucide-react";

// Helper: icon per lesson type
const LessonIcon = ({ type }) => {
  if (type === "video") return <PlayCircle className="h-4 w-4 text-[#1976D2] shrink-0" aria-hidden="true" />;
  if (type === "quiz")  return <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />;
  return <FileText className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" />;
};

const ModuleAccordion = ({ modules = [] }) => {
  const [openModule, setOpenModule] = useState(null);

  const toggleModule = (id) => {
    setOpenModule((prev) => (prev === id ? null : id));
  };

  if (modules.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8 text-sm">
        No modules available for this course yet.
      </p>
    );
  }

  return (
    <section aria-label="Course modules" className="w-full space-y-3">
      {modules.map((module, index) => {
        const isOpen = openModule === module.id;
        const lessonCount = module.lessons?.length ?? 0;

        return (
          <div
            key={module.id}
            className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md"
          >
            {/* ── Accordion Header ── */}
            <button
              onClick={() => toggleModule(module.id)}
              aria-expanded={isOpen}
              aria-controls={`module-panel-${module.id}`}
              id={`module-header-${module.id}`}
              className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 py-4 text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-inset"
              style={{ backgroundColor: isOpen ? "#EFF6FF" : "#F9FAFB" }}
            >
              {/* Left: index + title + count */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Module number badge */}
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "#1976D2" }}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                    {module.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                    {module.duration ? ` · ${module.duration}` : ""}
                  </p>
                </div>
              </div>

              {/* Right: chevron */}
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {/* ── Accordion Panel ── */}
            <div
              id={`module-panel-${module.id}`}
              role="region"
              aria-labelledby={`module-header-${module.id}`}
              hidden={!isOpen}
            >
              {isOpen && (
                <ul className="divide-y divide-gray-100 px-4 sm:px-6 py-2">
                  {module.lessons?.length > 0 ? (
                    module.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex items-center gap-3 py-2.5 text-sm text-gray-700"
                      >
                        <LessonIcon type={lesson.type} />
                        <span className="flex-1 truncate">{lesson.title}</span>
                        {lesson.duration && (
                          <span className="shrink-0 text-xs text-gray-400">
                            {lesson.duration}
                          </span>
                        )}
                        {lesson.free && (
                          <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-200">
                            Free
                          </span>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="py-3 text-sm text-gray-400 italic">
                      No lessons in this module yet.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ModuleAccordion;