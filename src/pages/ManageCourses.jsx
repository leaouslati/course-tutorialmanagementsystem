import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { courses as initialCourses } from "../data/mockdata";
import {
  PlusCircle, Edit, Trash2, CheckCircle, AlertCircle,
  Search as SearchIcon, BookOpen, Clock, Star, Users, X, LayoutGrid
} from "lucide-react";

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
const categoryOptions = ["Programming", "Web Development", "Design", "Mathematics", "Language"];

const badge = (difficulty) => {
  const map = {
    Beginner: { cls: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
    Intermediate: { cls: "bg-amber-100 text-amber-700 border border-amber-200", dot: "bg-amber-500" },
    Advanced: { cls: "bg-rose-100 text-rose-700 border border-rose-200", dot: "bg-rose-500" },
  };
  return map[difficulty] || { cls: "bg-slate-100 text-slate-600", dot: "bg-slate-400" };
};

const Field = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-600">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
    err ? "border-red-400 focus:ring-red-400/40" : "border-slate-200 focus:border-[#1976D2] focus:ring-[#1976D2]/20"
  }`;

const selectCls = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-[#1976D2]/20 focus:border-[#1976D2]";

export default function ManageCourses() {
  const [courses, setCourses] = useState([...initialCourses]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    title: "", shortDescription: "", description: "",
    category: "Programming", difficulty: "Beginner",
    duration: "60", rating: "4.5", studentsCount: "0",
    image: "", instructorId: "u2",
  });

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter((c) =>
      [c.title, c.shortDescription, c.category, c.difficulty].join(" ").toLowerCase().includes(q)
    );
  }, [courses, search]);

  useEffect(() => {
    if (!message.text) return;
    const t = setTimeout(() => setMessage({ text: "", type: "success" }), 2800);
    return () => clearTimeout(t);
  }, [message.text]);

  const resetForm = () => {
    setEditingId(null);
    setFormErrors({});
    setForm({ title: "", shortDescription: "", description: "", category: "Programming", difficulty: "Beginner", duration: "60", rating: "4.5", studentsCount: "0", image: "", instructorId: "u2" });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.shortDescription.trim()) e.shortDescription = "Short description is required.";
    if (!form.description.trim()) e.description = "Full description is required.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) {
      setMessage({ text: "Please fill in all required fields.", type: "error" });
      return;
    }
    const newCourse = {
      ...form, id: editingId || `c${Date.now()}`,
      duration: Number(form.duration), rating: Number(form.rating),
      studentsCount: Number(form.studentsCount),
      createdAt: new Date().toISOString().split("T")[0],
    };
    if (editingId) {
      setCourses((prev) => prev.map((item) => (item.id === editingId ? newCourse : item)));
      setMessage({ text: "Course updated successfully.", type: "success" });
    } else {
      setCourses((prev) => [newCourse, ...prev]);
      setMessage({ text: "Course added to the catalog.", type: "success" });
    }
    resetForm();
  };

  const startEdit = (course) => {
    setEditingId(course.id);
    setFormErrors({});
    setForm({
      title: course.title || "", shortDescription: course.shortDescription || "",
      description: course.description || "", category: course.category || "Programming",
      difficulty: course.difficulty || "Beginner", duration: course.duration?.toString() || "60",
      rating: course.rating?.toString() || "4.5", studentsCount: course.studentsCount?.toString() || "0",
      image: course.image || "", instructorId: course.instructorId || "u2",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeCourse = (id) => {
    if (window.confirm("Delete this course permanently?")) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setMessage({ text: "Course removed from catalog.", type: "success" });
    }
  };

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#F4F8FD] text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1976D2] shadow-lg">
            <LayoutGrid className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Manage Courses</h1>
          <p className="mt-2 text-gray-600 text-sm">
            Add, edit, and organise your course catalog in one place.
          </p>
        </div>

        {/* ── Notification ── */}
        {message.text && (
          <div className={`mb-6 flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-sm ${
            message.type === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-emerald-50 border border-emerald-200 text-emerald-700"
          }`}>
            {message.type === "error"
              ? <AlertCircle className="h-4 w-4 shrink-0" />
              : <CheckCircle className="h-4 w-4 shrink-0" />}
            {message.text}
          </div>
        )}

        {/* ── Form Card ── */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-md">

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1976D2]">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight text-gray-900">
                  {editingId ? "Edit Course" : "New Course"}
                </h2>
                <p className="text-xs text-gray-500">{editingId ? "Update the course details below." : "Fill in the details to publish a new course."}</p>
              </div>
            </div>
            {editingId && (
              <button onClick={resetForm} className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition">
                <X className="h-3.5 w-3.5" /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            <Field label="Course Title *" error={formErrors.title}>
              <input value={form.title} onChange={set("title")} className={inputCls(formErrors.title)} placeholder="e.g. Complete JavaScript Bootcamp" />
            </Field>

            <Field label="Short Description *" error={formErrors.shortDescription}>
              <input value={form.shortDescription} onChange={set("shortDescription")} className={inputCls(formErrors.shortDescription)} placeholder="A one-line pitch for your course" />
            </Field>

            <Field label="Full Description *" error={formErrors.description}>
              <div className="lg:col-span-1">
                <textarea value={form.description} onChange={set("description")} className={`${inputCls(formErrors.description)} resize-none`} rows={4} placeholder="Describe what learners will achieve..." />
              </div>
            </Field>

            <div className="space-y-5">
              <Field label="Category">
                <select value={form.category} onChange={set("category")} className={selectCls}>
                  {categoryOptions.map((o) => <option key={o} value={o} className="text-slate-900">{o}</option>)}
                </select>
              </Field>
              <Field label="Difficulty">
                <select value={form.difficulty} onChange={set("difficulty")} className={selectCls}>
                  {difficultyOptions.map((o) => <option key={o} value={o} className="text-slate-900">{o}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Duration (minutes)">
              <input type="number" min={10} value={form.duration} onChange={set("duration")} className={inputCls(false)} placeholder="60" />
            </Field>

            <Field label="Rating (0–5)">
              <input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={set("rating")} className={inputCls(false)} placeholder="4.5" />
            </Field>

            <Field label="Enrolled Students">
              <input type="number" min={0} value={form.studentsCount} onChange={set("studentsCount")} className={inputCls(false)} placeholder="0" />
            </Field>

            <Field label="Image URL">
              <input value={form.image} onChange={set("image")} className={inputCls(false)} placeholder="https://..." />
            </Field>

            <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold text-center shadow transition-colors duration-300 hover:shadow-lg border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] px-6 py-2" style={{backgroundColor:"#1976D2"}} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0094c5")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}>
                {editingId ? <><Edit className="h-4 w-4" /> Update Course</> : <><PlusCircle className="h-4 w-4" /> Add Course</>}
              </button>
              <button type="button" onClick={resetForm} className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold text-center shadow transition-colors duration-300 hover:shadow-lg border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] px-6 py-2" style={{backgroundColor:"#1976D2"}} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0094c5")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}>
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* ── Catalog ── */}
        <div>
          {/* Search */}
          <div className="mb-6 relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by title, category, difficulty…"
              className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/20 focus:border-[#1976D2] transition"
            />
          </div>

          {/* Stats strip */}
          <p className="mb-4 text-xs text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-bold">{filteredCourses.length}</span> of <span className="text-gray-900 font-bold">{courses.length}</span> courses
          </p>

          {/* Grid */}
          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
              <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-50" />
              <p className="font-semibold">No matching courses found.</p>
              <p className="text-xs mt-1 opacity-70">Try a different search term or add a new course above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredCourses.map((course) => {
                const diff = badge(course.difficulty);
                return (
                  <article key={course.id} className="group flex flex-col rounded-2xl bg-white shadow transition hover:shadow-xl duration-200" style={{boxShadow:"0 2px 12px 0 rgba(0,0,0,0.10)"}}>
                    {/* Card image */}
                    {course.image ? (
                      <img src={course.image} alt={course.title} className="h-48 w-full rounded-t-2xl object-cover" />
                    ) : (
                      <div className="h-48 w-full rounded-t-2xl bg-gradient-to-br from-blue-300 to-indigo-500 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-white/60" />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-5">
                      {/* Title + badge */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">{course.title}</h3>
                        <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${diff.cls}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
                          {course.difficulty}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.shortDescription}</p>

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{course.category}</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{course.duration} min</span>
                        <span className="flex items-center gap-1"><Star className="h-4 w-4 text-amber-400" />{course.rating}</span>
                        <span className="flex items-center gap-1"><Users className="h-4 w-4" />{course.studentsCount?.toLocaleString()}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 mt-auto">
                        <button onClick={() => startEdit(course)} className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold shadow transition-colors duration-300 hover:shadow-lg border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] px-4 py-2.5" style={{backgroundColor:"#1976D2"}} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0094c5")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}>
                          <Edit className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={() => removeCourse(course.id)} className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-white font-semibold shadow transition-colors duration-300 hover:shadow-lg border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] px-4 py-2.5" style={{backgroundColor:"#1976D2"}} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0094c5")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            
          )}
        </div>
      </main>
    </div>
  );
}