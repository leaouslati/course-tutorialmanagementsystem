// src/components/CourseCard.jsx
import React from "react";
import { users } from "../data/mockdata";

function CourseCard({ course }) {

  // find instructor using instructorId
  const instructor = users.find(
    (user) => user.id === course.instructorId
  );

  return (
    <div style={styles.card}>
      
      {/* Course Image */}
      <img
        src={course.image}
        alt={course.title}
        style={styles.image}
      />

      <div style={styles.content}>
        
        {/* Title */}
        <h3 style={styles.title}>{course.title}</h3>

        {/* Instructor */}
        <p style={styles.instructor}>
          Instructor: {instructor ? instructor.name : "Unknown"}
        </p>

        {/* Description */}
        <p style={styles.description}>
          {course.shortDescription}
        </p>

        {/* Extra Info */}
        <div style={styles.info}>
          <span>{course.category}</span>
          <span>{course.difficulty}</span>
        </div>

        <div style={styles.info}>
          <span>⏱ {course.duration} min</span>
          <span>⭐ {course.rating}</span>
          <span>👨‍🎓 {course.studentsCount}</span>
        </div>

      </div>
    </div>
  );
}

export default CourseCard;


const styles = {
  card: {
    width: "280px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "0.3s",
  },

  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },

  content: {
    padding: "15px",
  },

  title: {
    margin: "0 0 5px 0",
  },

  instructor: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },

  description: {
    fontSize: "14px",
    marginBottom: "10px",
  },

  info: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#444",
    marginTop: "5px",
  },
};