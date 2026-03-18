import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { courses, users } from "../data/mockdata.js";
import Navbar from "../components/Navbar.jsx";
import { Check, RotateCcw } from "lucide-react";

export default function CourseDetails() {
  const { id } = useParams();
  const course = courses.find(c => c.id === id);
  const [showPopup, setShowPopup] = useState(false);

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">Course not found</h2>
          <Link to="/courses" className="text-blue-500 underline">
            Back to Courses
          </Link>
        </div>
      </>
    );
  }

  const instructor = users.find(u => u.id === course.instructorId);

  const handleEnroll = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // popup hides after 3s
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 w-full p-6">

        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/courses"
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <RotateCcw size={18} />
            Back to Courses
          </Link>
        </div>

        {/* Course Main Section */}
        <div className="flex flex-col md:flex-row w-full text-gray-700">

          {/* Image */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          {/* Course Info */}
          <div className="flex-1 md:ml-6">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-500 mb-2">
              Instructor: {instructor ? instructor.name : "Unknown"}
            </p>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <p className="text-gray-700 mb-2">Duration: {course.duration ?? "N/A"} min</p>
            <p className="text-gray-700 mb-2">Difficulty: {course.difficulty || "N/A"}</p>
            <p className="text-gray-700 mb-2">Students Enrolled: {course.studentsCount ?? 0}</p>
            <p className="text-gray-700 mb-4">Rating: ⭐ {course.rating ?? "N/A"}</p>

            {/* Enroll Button */}
            <button
              className="w-full py-2 rounded-lg text-white font-semibold text-center shadow transition-colors duration-300 hover:shadow-lg border-none focus:outline-none focus-visible:outline-none focus:ring-0"
              style={{ backgroundColor: "#1976D2" }}
              onClick={handleEnroll}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0094c5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
            >
              Enroll Now
            </button>
          </div>
        </div>

        {/* Popup Message */}
        {showPopup && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <Check size={20} />
            Successfully Enrolled in "{course.title}"!
          </div>
        )}
      </div>
    </>
  );
}