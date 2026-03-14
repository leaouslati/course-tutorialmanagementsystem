import React, { useState } from "react";

const ModuleAccordion = ({ modules }) => {
  const [openModule, setOpenModule] = useState(null);

  const toggleModule = (moduleId) => {
    setOpenModule((prev) => (prev === moduleId ? null : moduleId));
  };

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <div
          key={module.id}
          className="border rounded-lg overflow-hidden bg-white shadow-sm"
        >
          {/* Module Header */}
          <div
            onClick={() => toggleModule(module.id)}
            className="cursor-pointer font-semibold p-4 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span>{module.title}</span>
            <span className="text-gray-500">
              {openModule === module.id ? "▲" : "▼"}
            </span>
          </div>

          {/* Lessons List */}
          {openModule === module.id && (
            <div className="bg-white divide-y">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Completion Indicator */}
                    <span
                      className={`w-4 h-4 rounded-full flex-shrink-0 ${
                        lesson.completed
                          ? "bg-green-500"
                          : "border-2 border-gray-300"
                      }`}
                    />
                    <span
                      className={
                        lesson.completed
                          ? "line-through text-gray-400"
                          : ""
                      }
                    >
                      {lesson.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">
                      {lesson.duration}
                    </span>

                    {!lesson.completed && (
                      <button className="text-blue-600 text-sm border border-blue-600 rounded px-2 py-1 hover:bg-blue-50 transition-colors">
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ModuleAccordion;