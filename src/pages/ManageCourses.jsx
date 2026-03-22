import React, { useState, useEffect } from "react";

const ManageCourses = () => {
  const [title, setTitle] = useState("");
  const [courses, setCourses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const description = "Admin managed course";
  const duration = "N/A";
  const category = "General";

  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) setCourses(JSON.parse(savedCourses));
  }, []);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Enter a course title.");

    if (editingId) {
      // Update
      setCourses(courses.map(c => c.id === editingId ? { ...c, title: title.trim() } : c));
      setEditingId(null);
    } else {
      // Add
      setCourses([...courses, { id: Date.now(), title: title.trim(), description, duration, category }]);
    }
    setTitle("");
  };

  const handleEdit = (course) => {
    setTitle(course.title);
    setEditingId(course.id);
  };

  const handleDelete = (id) => setCourses(courses.filter(c => c.id !== id));

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Manage Courses</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter course title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border p-2 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-400 text-white rounded">
            Cancel
          </button>
        )}
      </form>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses added yet.</p>
      ) : (
        <ul className="space-y-3">
          {courses.map((course) => (
            <li key={course.id} className="flex justify-between items-center p-3 border rounded shadow-sm">
              <div>
                <p className="font-semibold">{course.title}</p>
                <p className="text-sm text-gray-500">{course.description} • {course.duration} • {course.category}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(course)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                <button onClick={() => handleDelete(course.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageCourses;


