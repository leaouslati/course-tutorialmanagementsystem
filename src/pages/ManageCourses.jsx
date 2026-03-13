import React, { useState, useEffect } from "react";
import { useNavigator } from "../hooks/useNavigator";
import { useAuth } from "../hooks/useAuth";

const ManageCourses = () => {
  const { navigate } = useNavigator();
  const { user } = useAuth();

  const description = "Admin page to manage courses";
  const duration = "N/A";
  const category = "Admin";

  const [title, setTitle] = useState("");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const saved = localStorage.getItem("courses");
    if (saved) setCourses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert("Course title cannot be empty");

    const newCourse = {
      id: Date.now(),
      title,
      description,
      duration,
      category,
    };

    setCourses([...courses, newCourse]);
    setTitle("");
    console.log("Added course:", newCourse);
  };

  const handleDelete = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const handleEdit = (id) => {
    const newTitle = prompt("Enter new course title:");
    if (newTitle) {
      setCourses(
        courses.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
      );
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Courses</h1>

      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={title}
          placeholder="Course Title"
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">
          Add Course
        </button>
      </form>

      <div className="mt-4">
        <h2 className="font-bold mb-2">Current Courses:</h2>
        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {courses.map((course) => (
              <li key={course.id} className="flex justify-between items-center">
                <span>
                  {course.title} — {course.description} ({course.duration}) [{course.category}]
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(course.id)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageCourses;