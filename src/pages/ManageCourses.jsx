import React, { useEffect, useMemo, useState } from "react";
import { courses as initialCourses } from "../data/mockdata";
import {
  PlusCircle, Edit, Trash2, CheckCircle, AlertCircle,
  Search as SearchIcon, BookOpen, Clock, Star, User, XCircle,
  AlertTriangle,
} from "lucide-react";

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
const categoryOptions = ["Programming", "Web Development", "Design", "Mathematics", "Language"];

const badge = (difficulty, darkMode) => {
  const map = {
    Beginner: darkMode ? "bg-green-900 text-green-200 border border-green-700" : "bg-green-100 text-green-800",
    Intermediate: darkMode ? "bg-yellow-900 text-yellow-200 border border-yellow-700" : "bg-yellow-100 text-yellow-800",
    Advanced: darkMode ? "bg-red-900 text-red-200 border border-red-700" : "bg-red-100 text-red-800",
  };
  return map[difficulty] || (darkMode ? "bg-slate-800 text-slate-300 border border-slate-600" : "bg-slate-100 text-slate-600");
};

const emptyForm = {
  title: "", shortDescription: "", description: "",
  category: "Programming", difficulty: "Beginner",
  duration: "60", rating: "4.5", studentsCount: "0",
  image: "", instructorId: "u2",
};

/* ─── Course Form Modal ─────────────────────────────────────────────────── */
function CourseModal({ open, onClose, onSave, initial, isEditing, darkMode }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});
  const titleId = "course-modal-title";

  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const headingCol = darkMode ? "#f1f5f9" : "#111827";
  const subCol = darkMode ? "#94a3b8" : "#4b5563";
  const inputBg = darkMode ? "#0a1628" : "#ffffff";
  const inputText = darkMode ? "#f1f5f9" : "#1f2937";
  const borderCol = darkMode ? "#1a3a6b" : "#e2e8f0";
  const labelCol = darkMode ? "#94a3b8" : "#111827";
  const cancelBg = darkMode ? "transparent" : "#f9fafb";
  const cancelBorder = darkMode ? "#1a3a6b" : "#e5e7eb";
  const cancelText = darkMode ? "#94a3b8" : "#374151";

  useEffect(() => { setForm(initial || emptyForm); setErrors({}); }, [initial, open]);
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.shortDescription.trim()) e.shortDescription = "Short description is required.";
    if (!form.description.trim()) e.description = "Full description is required.";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave(form);
  };

  const inputStyle = (hasErr) => ({
    backgroundColor: inputBg,
    color: inputText,
    border: `1px solid ${hasErr ? "#ef4444" : borderCol}`,
    boxShadow: "none",
    width: "100%",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s",
  });

  const Field = ({ label, error, children, htmlFor }) => (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} style={{ display: "block", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: labelCol }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs flex items-center gap-1" style={{ color: "#ef4444" }} role="alert">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />{error}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: cardBg }}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 rounded-t-2xl" style={{ background: "linear-gradient(90deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)" }}>
          <div>
            <h2 id={titleId} className="text-lg font-extrabold text-white tracking-tight">
              {isEditing ? "Edit Course" : "Add New Course"}
            </h2>
            <p style={{ fontSize: 12, color: "#bfdbfe", marginTop: 2 }}>
              {isEditing ? "Update the course details below." : "Fill in the details to publish a new course."}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close modal" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: "rgba(255,255,255,0.85)" }}>
            <XCircle style={{ width: 28, height: 28 }} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Field label="Course Title *" error={errors.title} htmlFor="field-title">
            <input id="field-title" value={form.title} onChange={set("title")} style={inputStyle(errors.title)} placeholder="e.g. Complete JavaScript Bootcamp" aria-required="true" aria-invalid={!!errors.title} />
          </Field>

          <Field label="Short Description *" error={errors.shortDescription} htmlFor="field-shortDesc">
            <input id="field-shortDesc" value={form.shortDescription} onChange={set("shortDescription")} style={inputStyle(errors.shortDescription)} placeholder="A one-line pitch" aria-required="true" aria-invalid={!!errors.shortDescription} />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Full Description *" error={errors.description} htmlFor="field-desc">
              <textarea id="field-desc" value={form.description} onChange={set("description")} style={{ ...inputStyle(errors.description), resize: "none" }} rows={2} placeholder="Describe what learners will achieve..." aria-required="true" aria-invalid={!!errors.description} />
            </Field>
          </div>

          <Field label="Category" htmlFor="field-category">
            <select id="field-category" value={form.category} onChange={set("category")} style={inputStyle(false)}>
              {categoryOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>

          <Field label="Difficulty" htmlFor="field-difficulty">
            <select id="field-difficulty" value={form.difficulty} onChange={set("difficulty")} style={inputStyle(false)}>
              {difficultyOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>

          <Field label="Duration (minutes)" htmlFor="field-duration">
            <input id="field-duration" type="number" min={10} value={form.duration} onChange={set("duration")} style={inputStyle(false)} placeholder="60" />
          </Field>

          <Field label="Rating (0–5)" htmlFor="field-rating">
            <input id="field-rating" type="number" step="0.1" min={0} max={5} value={form.rating} onChange={set("rating")} style={inputStyle(false)} placeholder="4.5" />
          </Field>

          <Field label="Enrolled Students" htmlFor="field-students">
            <input id="field-students" type="number" min={0} value={form.studentsCount} onChange={set("studentsCount")} style={inputStyle(false)} placeholder="0" />
          </Field>

          <Field label="Image URL" htmlFor="field-image">
            <input id="field-image" value={form.image} onChange={set("image")} style={inputStyle(false)} placeholder="https://..." />
          </Field>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2"
              style={{ backgroundColor: "#1976D2" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0094c5")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
            >
              {isEditing ? <><Edit className="h-4 w-4" /> Update Course</> : <><PlusCircle className="h-4 w-4" /> Add Course</>}
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none"
              style={{ backgroundColor: cancelBg, border: `1px solid ${cancelBorder}`, color: cancelText }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = cancelBg)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Delete Confirm Modal ──────────────────────────────────────────────── */
function DeleteModal({ open, onClose, onConfirm, title, darkMode }) {
  const titleId = "delete-modal-title";
  const descId = "delete-modal-desc";
  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const headingCol = darkMode ? "#f1f5f9" : "#111827";
  const bodyText = darkMode ? "#cbd5e1" : "#6b7280";
  const nameCol = darkMode ? "#f1f5f9" : "#374151";
  const cancelBg = darkMode ? "transparent" : "#f9fafb";
  const cancelBorder = darkMode ? "#1a3a6b" : "#e5e7eb";
  const cancelText = darkMode ? "#94a3b8" : "#374151";

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center" style={{ backgroundColor: cardBg }}>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ backgroundColor: darkMode ? "rgba(239,68,68,0.15)" : "#fee2e2" }} aria-hidden="true">
          <AlertTriangle className="h-6 w-6" style={{ color: "#ef4444" }} />
        </div>
        <h3 id={titleId} className="text-lg font-extrabold mb-1" style={{ color: headingCol }}>Delete Course?</h3>
        <p id={descId} className="text-sm mb-6" style={{ color: bodyText }}>
          "<span className="font-semibold" style={{ color: nameCol }}>{title}</span>" will be permanently removed from the catalog.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
            style={{ backgroundColor: "#dc2626" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
          >
            <Trash2 className="h-4 w-4" /> Delete Course
          </button>
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            style={{ backgroundColor: cancelBg, border: `1px solid ${cancelBorder}`, color: cancelText }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = cancelBg)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function ManageCourses({ darkMode = false }) {
  const [courses, setCourses] = useState([...initialCourses]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ text: "", type: "success" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Color tokens (exact match to your other pages) ──
  const pageBg = darkMode ? "#060f1e" : "#F4F8FD";
  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder = darkMode ? "#1a3a6b" : "transparent";
  const headingCol = darkMode ? "#f1f5f9" : "#111827";
  const subCol = darkMode ? "#94a3b8" : "#4b5563";
  const mutedCol = darkMode ? "#64748b" : "#94a3b8";
  const bodyText = darkMode ? "#cbd5e1" : "#4b5563";
  const inputBg = darkMode ? "#0f1f3d" : "#ffffff";
  const inputText = darkMode ? "#f1f5f9" : "#1f2937";
  const inputBorder = darkMode ? "#1a3a6b" : "transparent";
  const countText = darkMode ? "#94a3b8" : "#4b5563";

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter((c) =>
      [c.title, c.shortDescription, c.category].join(" ").toLowerCase().includes(q)
    );
  }, [courses, search]);

  useEffect(() => {
    if (!toast.text) return;
    const t = setTimeout(() => setToast({ text: "", type: "success" }), 2800);
    return () => clearTimeout(t);
  }, [toast.text]);

  const notify = (text, type = "success") => setToast({ text, type });
  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (course) => { setEditing(course); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleSave = (form) => {
    if (editingCourse) {
      const updated = { ...editingCourse, ...form, duration: Number(form.duration), rating: Number(form.rating), studentsCount: Number(form.studentsCount) };
      setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? updated : c)));
      notify("Course updated successfully.");
    } else {
      const newCourse = { ...form, id: `c${Date.now()}`, duration: Number(form.duration), rating: Number(form.rating), studentsCount: Number(form.studentsCount), createdAt: new Date().toISOString().split("T")[0] };
      setCourses((prev) => [newCourse, ...prev]);
      notify("Course added to the catalog.");
    }
    closeModal();
  };

  const confirmDelete = () => {
    setCourses((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    notify("Course removed from catalog.");
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: pageBg }}>

      {/* Toast */}
      <div aria-live="polite" aria-atomic="true" className="fixed top-4 right-4 z-50 pointer-events-none">
        {toast.text && (
          <div
            className="pointer-events-auto flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium shadow-lg"
            style={
              toast.type === "error"
                ? { backgroundColor: darkMode ? "rgba(239,68,68,0.15)" : "#fef2f2", border: `1px solid ${darkMode ? "#7f1d1d" : "#fca5a5"}`, color: darkMode ? "#f87171" : "#b91c1c" }
                : { backgroundColor: darkMode ? "rgba(34,197,94,0.15)" : "#f0fdf4", border: `1px solid ${darkMode ? "#166534" : "#86efac"}`, color: darkMode ? "#4ade80" : "#15803d" }
            }
          >
            {toast.type === "error"
              ? <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              : <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />}
            {toast.text}
          </div>
        )}
      </div>

      <main className="w-full px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1
            className="font-extrabold tracking-tight leading-tight"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)", color: headingCol }}
          >
            Manage Courses
          </h1>
          <p className="mt-1 sm:mt-2 font-semibold" style={{ fontSize: "clamp(0.8rem, 2.5vw, 1.1rem)", color: subCol }}>
            Add, edit, and organise your course catalog in one place.
          </p>
        </header>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <label htmlFor="course-search" className="sr-only">Search courses</label>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: mutedCol }} aria-hidden="true" />
            <input
              id="course-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category…"
              className="w-full rounded-xl pl-11 pr-4 py-3 text-sm transition focus:outline-none"
              style={{
                backgroundColor: inputBg,
                color: inputText,
                border: `1px solid ${inputBorder}`,
                boxShadow: darkMode ? "none" : "0 2px 12px 0 rgba(0,0,0,0.08)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1976D2")}
              onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
            />
          </div>

          {/* Add Button */}
          <button
            onClick={openAdd}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2 w-full sm:w-auto"
            style={{ backgroundColor: "#1976D2" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
          >
            <PlusCircle className="h-4 w-4" aria-hidden="true" /> Add Course
          </button>
        </div>

        {/* Count */}
        <p className="mb-4 text-xs font-medium" style={{ color: countText }} aria-live="polite" aria-atomic="true">
          Showing <span className="font-bold" style={{ color: headingCol }}>{filteredCourses.length}</span> of{" "}
          <span className="font-bold" style={{ color: headingCol }}>{courses.length}</span> courses
        </p>

        {/* Grid */}
        {filteredCourses.length === 0 ? (
          <div
            className="rounded-2xl border-dashed py-20 text-center"
            style={{ border: `1px dashed ${darkMode ? "#1a3a6b" : "#d1d5db"}`, color: mutedCol }}
            role="status"
          >
            <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-40" aria-hidden="true" />
            <p className="font-semibold">No matching courses found.</p>
            <p className="text-xs mt-1 opacity-70">Try a different search or add a new course.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0" aria-label="Course catalog">
            {filteredCourses.map((course) => {
              const diff = badge(course.difficulty, darkMode); return (
                <li key={course.id}>
                  <article
                    className="flex flex-col rounded-xl overflow-hidden h-full transition-all duration-300"
                    style={{
                      backgroundColor: cardBg,
                      border: `1px solid ${cardBorder}`,
                      boxShadow: darkMode ? "none" : "0 2px 12px 0 rgba(0,0,0,0.08)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = darkMode
                        ? "0 0 24px 2px rgba(25,118,210,0.15)"
                        : "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = darkMode ? "none" : "0 2px 12px 0 rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    aria-label={course.title}
                  >
                    {/* Image */}
                    {course.image ? (
                      <img src={course.image} alt="" role="presentation" className="h-40 w-full object-cover" />
                    ) : (
                      <div className="h-40 w-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#1565C0 0%,#1976D2 100%)" }} aria-hidden="true">
                        <BookOpen className="h-10 w-10 text-white/50" />
                      </div>
                    )}

                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      {/* Badge */}
                      <span className={`self-start inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${diff}`}>
                        {course.difficulty}
                      </span>

                      {/* Title */}
                      <h2 className="text-base sm:text-lg font-bold leading-snug line-clamp-2 mb-2" style={{ color: headingCol }}>
                        {course.title}
                      </h2>

                      {/* Short desc */}
                      <p className="text-sm line-clamp-2 mb-2" style={{ color: bodyText }}>{course.shortDescription}</p>

                      {/* Category */}
                      <p className="text-sm mb-3" style={{ color: subCol }}>
                        <span className="font-semibold" style={{ color: darkMode ? "#f1f5f9" : "#374151" }}>Category:</span> {course.category || "General"}
                      </p>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm" style={{ color: subCol }}>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" style={{ color: "#1976D2" }} aria-hidden="true" />
                          <span><span className="sr-only">Duration: </span>{course.duration} min</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" style={{ color: "#1976D2" }} aria-hidden="true" />
                          <span><span className="sr-only">Students enrolled: </span>{course.studentsCount?.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" style={{ color: "#facc15", fill: "#facc15" }} aria-hidden="true" />
                          <span><span className="sr-only">Rating: </span>{course.rating}</span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => openEdit(course)}
                          aria-label={`Edit ${course.title}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-1 border-0"
                          style={{ backgroundColor: "#1976D2" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
                        >
                          <Edit className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: course.id, title: course.title })}
                          aria-label={`Delete ${course.title}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
                          style={{
                            color: darkMode ? "#fca5a5" : "#dc2626",
                            backgroundColor: darkMode ? "rgba(239,68,68,0.18)" : "#fef2f2",
                            border: `1px solid ${darkMode ? "rgba(239,68,68,0.5)" : "#fca5a5"}`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = darkMode ? "rgba(239,68,68,0.28)" : "#fee2e2";
                            e.currentTarget.style.borderColor = darkMode ? "rgba(239,68,68,0.75)" : "#ef4444";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = darkMode ? "rgba(239,68,68,0.18)" : "#fef2f2";
                            e.currentTarget.style.borderColor = darkMode ? "rgba(239,68,68,0.5)" : "#fca5a5";
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* Modals */}
      <CourseModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        darkMode={darkMode}
        initial={editingCourse
          ? { ...editingCourse, duration: editingCourse.duration?.toString(), rating: editingCourse.rating?.toString(), studentsCount: editingCourse.studentsCount?.toString() }
          : emptyForm
        }
        isEditing={!!editingCourse}
      />

      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={deleteTarget?.title}
        darkMode={darkMode}
      />
    </div>
  );
}