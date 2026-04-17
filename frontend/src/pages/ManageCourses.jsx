import { useState, useEffect } from 'react';
import { authFetch } from '../utils/authFetch';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    difficulty: '',
    duration: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/courses?instructorId=me');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      showToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAddModal = () => {
    setEditingCourse(null);
    setForm({ title: '', shortDescription: '', description: '', category: '', difficulty: '', duration: '', imageUrl: '' });
    setModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      shortDescription: course.short_description,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration,
      imageUrl: course.image_url,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      let res;
      if (editingCourse) {
        res = await authFetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        res = await authFetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) throw new Error('Request failed');

      showToast(editingCourse ? 'Course updated!' : 'Course created!', 'success');
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      showToast('Something went wrong', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Course deleted', 'success');
      fetchCourses();
    } catch (err) {
      showToast('Failed to delete course', 'error');
    }
  };

  return (
    <div>
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <>
          <button onClick={openAddModal}>Add Course</button>
          <ul>
            {courses.map(course => (
              <li key={course.id}>
                <span>{course.title}</span>
                <button onClick={() => openEditModal(course)}>Edit</button>
                <button onClick={() => handleDelete(course.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {modalOpen && (
        <div className="modal">
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Short Description"
            value={form.shortDescription}
            onChange={e => setForm({ ...form, shortDescription: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Difficulty"
            value={form.difficulty}
            onChange={e => setForm({ ...form, difficulty: e.target.value })}
          />
          <input
            placeholder="Duration"
            value={form.duration}
            onChange={e => setForm({ ...form, duration: e.target.value })}
          />
          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
          />
          <button onClick={handleSubmit}>
            {editingCourse ? 'Update Course' : 'Create Course'}
          </button>
          <button onClick={() => setModalOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;