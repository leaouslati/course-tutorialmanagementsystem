import React, 
{ 
  useState 
} 
from "react";

const ModuleAccordion = ({ modules }) => {
  const [openModule, setOpenModule] = useState(null);

  const toggleModule = (id) => {
    if (openModule === id) {
      setOpenModule(null);
    } else {
      setOpenModule(id); 
    }
  };

  return (
    <div>
      {modules.map((module) => (
        <div key={module.id} style={{ marginBottom: "10px" }}>
          <div
            onClick={() => toggleModule(module.id)}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              background: "#f0f0f0",
              padding: "10px",
            }}
          >
            {module.title} {openModule === module.id ? "▲" : "▼"}
          </div>

          {openModule === module.id && (
            <div style={{ padding: "10px 20px" }}>
              {module.lessons.map((lesson) => (
                <div key={lesson.id}>
                  • {lesson.title}
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