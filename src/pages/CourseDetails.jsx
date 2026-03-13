import React from "react";
import { courses } from "../data/mockdata";
import CourseCard from "../components/CourseCard";

function Courses() {
  const course = courses[0]; // take the first course

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <CourseCard key={course.id} course={course} />
    </div>
  );
}

export default Courses;