import React, { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, PlayCircle, X, Clock } from "lucide-react";

const ModuleAccordion = ({ modules }) => {
  const [openModule, setOpenModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null); // full-screen lesson

  const toggleModule = (moduleId) =>
    setOpenModule((prev) => (prev === moduleId ? null : moduleId));

  const openLesson = (lesson) => setActiveLesson(lesson);
  const closeLesson = () => setActiveLesson(null);

  return (
    <>
      {/* ── Full-screen lesson overlay ── */}
      {activeLesson && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ backgroundColor: "#0D1117" }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
            style={{ borderColor: "#1E2A3A", backgroundColor: "#0D1117" }}
          >
            <div className="min-w-0">
              <p className="text-xs font-medium mb-0.5" style={{ color: "#90CAF9" }}>
                Now Playing
              </p>
              <h2 className="text-white font-semibold text-sm sm:text-base truncate">
                {activeLesson.title}
              </h2>
            </div>
            <button
              onClick={closeLesson}
              className="flex-shrink-0 ml-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition"
              style={{ backgroundColor: "#1E2A3A", color: "#90CAF9" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1E2A3A")}
            >
              <X size={15} />
              Exit
            </button>
          </div>

          {/* Video area */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            {activeLesson.videoUrl ? (
              <iframe
                src={activeLesson.videoUrl.replace("watch?v=", "embed/")}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full rounded-2xl shadow-2xl"
                style={{ maxWidth: "960px", aspectRatio: "16/9", border: "none" }}
              />
            ) : (
              <div
                className="w-full rounded-2xl flex items-center justify-center"
                style={{ maxWidth: "960px", aspectRatio: "16/9", backgroundColor: "#1E2A3A" }}
              >
                <p style={{ color: "#90CAF9" }} className="text-sm">No video available</p>
              </div>
            )}
          </div>

          {/* Bottom lesson info */}
          <div
            className="px-5 py-4 border-t flex items-center gap-4 flex-shrink-0"
            style={{ borderColor: "#1E2A3A", backgroundColor: "#0D1117" }}
          >
            <Clock size={14} color="#90CAF9" />
            <span className="text-sm" style={{ color: "#90CAF9" }}>
              {activeLesson.duration}
            </span>
            <span className="text-sm" style={{ color: "#4A6080" }}>
              {activeLesson.content}
            </span>
          </div>
        </div>
      )}

      {/* ── Accordion list ── */}
      <div className="space-y-3">
        {modules.map((module) => {
          const isOpen = openModule === module.id;
          const completedCount = module.lessons.filter((l) => l.completed).length;
          const totalCount = module.lessons.length;
          const allDone = completedCount === totalCount;
          const pct = Math.round((completedCount / totalCount) * 100);

          return (
            <div
              key={module.id}
              className="rounded-2xl overflow-hidden transition-shadow duration-200"
              style={{
                border: isOpen ? "1.5px solid #1976D2" : "1.5px solid #E5E7EB",
                backgroundColor: "#fff",
                boxShadow: isOpen ? "0 0 0 3px rgba(25,118,210,0.08)" : "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full text-left flex justify-between items-center px-5 py-4 transition-colors duration-150"
                style={{ backgroundColor: isOpen ? "#F0F7FF" : "transparent" }}
                onMouseEnter={(e) => {
                  if (!isOpen) e.currentTarget.style.backgroundColor = "#F9FAFB";
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {allDone ? (
                      <CheckCircle2 size={22} color="#22C55E" />
                    ) : (
                      <div
                        className="flex items-center justify-center rounded-full text-[10px] font-bold"
                        style={{
                          width: 22,
                          height: 22,
                          border: "2px solid #1976D2",
                          color: "#1976D2",
                        }}
                      >
                        {pct}%
                      </div>
                    )}
                  </div>
                  <div>
                    <p
                      className="font-semibold text-sm sm:text-base leading-tight"
                      style={{ color: isOpen ? "#1976D2" : "#111827" }}
                    >
                      {module.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                      {completedCount} / {totalCount} lessons complete
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={18}
                  color={isOpen ? "#1976D2" : "#6B7280"}
                  style={{
                    flexShrink: 0,
                    transition: "transform 0.3s ease",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Progress bar */}
              <div className="mx-5 h-[3px] rounded-full" style={{ backgroundColor: "#F3F4F6" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: allDone ? "#22C55E" : "#1976D2",
                  }}
                />
              </div>

              {/* Lessons */}
              <div
                style={{
                  maxHeight: isOpen ? `${module.lessons.length * 72}px` : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.35s ease",
                }}
              >
                <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
                  {module.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between px-5 py-3.5 transition-colors duration-150"
                      style={{ backgroundColor: "transparent" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {lesson.completed ? (
                          <CheckCircle2 size={18} color="#22C55E" className="flex-shrink-0" />
                        ) : (
                          <Circle size={18} color="#D1D5DB" className="flex-shrink-0" />
                        )}
                        <span
                          className="text-sm block truncate"
                          style={{
                            color: lesson.completed ? "#9CA3AF" : "#374151",
                            fontWeight: lesson.completed ? 400 : 500,
                            textDecoration: lesson.completed ? "line-through" : "none",
                          }}
                        >
                          {idx + 1}. {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="text-xs" style={{ color: "#9CA3AF" }}>
                          {lesson.duration}
                        </span>
                        {!lesson.completed && (
                          <button
                            onClick={() => openLesson(lesson)}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition"
                            style={{ backgroundColor: "#1976D2" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2196F3")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
                          >
                            <PlayCircle size={13} />
                            Start
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ModuleAccordion;