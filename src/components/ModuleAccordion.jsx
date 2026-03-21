import React, { useState } from "react";

const ModuleAccordion = ({ modules }) => {
  const [openModule, setOpenModule] = useState(null);

  const toggleModule = (id) => {
    setOpenModule((prev) => (prev === id ? null : id));
  };

  return (
    <section aria-label="Course modules" style={{ width: "100%" }}>
      {modules.map((module) => {
        const isOpen = openModule === module.id;
        return (
          <div
            key={module.id}
            style={{
              border: "0.5px solid #e0e0e0",
              borderRadius: "12px",
              marginBottom: "8px",
              overflow: "hidden",
            }}
          >
            <button
              id={`trigger-${module.id}`}
              aria-expanded={isOpen}
              aria-controls={`panel-${module.id}`}
              onClick={() => toggleModule(module.id)}
              className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "14px 16px",
                background: "#f5f5f5",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "15px",
                fontWeight: 500,
                color: "#111",
              }}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {module.title}
              </span>

              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "20px",
                  background: "#e6f1fb",
                  color: "#185fa5",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {module.lessons.length} lesson{module.lessons.length !== 1 ? "s" : ""}
              </span>

              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  transition: "transform 0.2s ease",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  color: "#666",
                }}
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>

            {isOpen && (
              <div
                id={`panel-${module.id}`}
                role="region"
                aria-labelledby={`trigger-${module.id}`}
              >
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: "8px 0 12px",
                    borderTop: "0.5px solid #e0e0e0",
                  }}
                >
                  {module.lessons.map((lesson) => (
                    <li
                      key={lesson.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#ccc",
                          flexShrink: 0,
                        }}
                      />
                      {lesson.title}
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "12px",
                          color: "#999",
                        }}
                      >
                        {lesson.duration} min
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ModuleAccordion;