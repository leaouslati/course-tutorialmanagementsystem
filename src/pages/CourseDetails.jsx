import React from "react";
import ModuleAccordion from "../components/ModuleAccordion";

const CourseDetails = () => {

  const modules = [
    {
      id: "m1",
      title: "Module 1",
      lessons: [
        { id: "l1", title: "Lesson 1" },
        { id: "l2", title: "Lesson 2" },
      ],
    },
    {
      id: "m2",
      title: "Module 2",
      lessons: [
        { id: "l3", title: "Lesson 3" },
        { id: "l4", title: "Lesson 4" },
      ],
    },
  ];

  return (
    <div>
      <h2>Course Details</h2>
      <ModuleAccordion modules={modules} />
    </div>
  );
};

export default CourseDetails;