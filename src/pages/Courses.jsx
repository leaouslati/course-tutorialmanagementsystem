import React from "react";
import { courses } from "../data/mockdata";
import CourseCard from "../components/CourseCard";

function Courses() {
  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

export default Courses;