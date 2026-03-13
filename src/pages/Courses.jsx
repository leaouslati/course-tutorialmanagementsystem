import React from "react";
import { courses } from "../data/mockdata";
import CourseCard from "../components/CourseCard";

function Courses() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center px-4 py-8">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

export default Courses;