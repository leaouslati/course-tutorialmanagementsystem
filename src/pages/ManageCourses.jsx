import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { courses as initialCourses } from "../data/mockdata";
import {
  PlusCircle, Edit, Trash2, CheckCircle, AlertCircle,
  Search as SearchIcon, BookOpen, Clock, Star, User, XCircle,
  AlertTriangle,
} from "lucide-react";

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
const categoryOptions = ["Programming", "Web Development", "Design", "Mathematics", "Language"];

const badge = (difficulty) => {
  const map = {
    Beginner:     { cls: "bg-green-100 text-green-800" },
    Intermediate: { cls: "bg-yellow-100 text-yellow-800" },
    Advanced:     { cls: "bg-red-100 text-red-800" },
  };
  return map[difficulty] || { cls: "bg-slate-100 text-slate-600" };
};

const inputCls = (err) =>
  `w-full rounded-lg border bg-white px-2.5 py-1.5 text-sm text-gray-900 transition focus:outline-none focus:ring-2 ${
    err ? "border-red-400 focus:ring-red-400/40" : "border-slate-200 focus:border-[#1976D2] focus:ring-[#1976D2]/20"
  }`;

const selectCls =
  "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-[#1976D2]/20 focus:border-[#1976D2]";

const Field = ({ label, error, children, htmlFor }) => (
  <div className="space-y-1.5">
    <label
      htmlFor={htmlFor}
      className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-900"
    >
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1" role="alert">
        <AlertCircle className="h-3 w-3" aria-hidden="true" />{error}
      </p>
    )}
  </div>
);

const PrimaryBtn = ({ onClick, type = "button", children, className = "", "aria-label": ariaLabel }) => (
  <button
    type={type}
    onClick={onClick}
    aria-label={ariaLabel}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2 ${className}`}
    style={{ backgroundColor: "#1976D2" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0094c5")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
  >
    {children}
  </button>
);

const emptyForm = {
  title: "", shortDescription: "", description: "",
  category: "Programming", difficulty: "Beginner",
  duration: "60", rating: "4.5", studentsCount: "0",
  image: "", instructorId: "u2",
};

/* ─── Course Form Modal ─────────────────────────────────────────────────── */
function CourseModal({ open, onClose, onSave, initial, isEditing }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});
  const titleId = "course-modal-title";

  useEffect(() => { setForm(initial || emptyForm); setErrors({}); }, [initial, open]);

  // Trap focus & close on Escape
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
    if (!form.title.trim())            e.title            = "Title is required.";
    if (!form.shortDescription.trim()) e.shortDescription = "Short description is required.";
    if (!form.description.trim())      e.description      = "Full description is required.";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 rounded-t-2xl"
          style={{ background: "linear-gradient(90deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)" }}
        >
          <div>
            <h2 id={titleId} className="text-lg font-extrabold text-white tracking-tight">
              {isEditing ? "Edit Course" : "Add New Course"}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              {isEditing ? "Update the course details below." : "Fill in the details to publish a new course."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.85)", borderRadius: 6 }}
          >
            <XCircle style={{ width: 28, height: 28 }} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <style>{`.modal-input::placeholder { color: #94a3b8; }`}</style>

          <Field label="Course Title *" error={errors.title} htmlFor="field-title">
            <input id="field-title" value={form.title} onChange={set("title")} className={`modal-input ${inputCls(errors.title)}`} placeholder="e.g. Complete JavaScript Bootcamp" aria-required="true" aria-invalid={!!errors.title} />
          </Field>

          <Field label="Short Description *" error={errors.shortDescription} htmlFor="field-shortDesc">
            <input id="field-shortDesc" value={form.shortDescription} onChange={set("shortDescription")} className={`modal-input ${inputCls(errors.shortDescription)}`} placeholder="A one-line pitch" aria-required="true" aria-invalid={!!errors.shortDescription} />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Full Description *" error={errors.description} htmlFor="field-desc">
              <textarea id="field-desc" value={form.description} onChange={set("description")} className={`modal-input ${inputCls(errors.description)} resize-none`} rows={2} placeholder="Describe what learners will achieve..." aria-required="true" aria-invalid={!!errors.description} />
            </Field>
          </div>

          <Field label="Category" htmlFor="field-category">
            <select id="field-category" value={form.category} onChange={set("category")} className={selectCls}>
              {categoryOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>

          <Field label="Difficulty" htmlFor="field-difficulty">
            <select id="field-difficulty" value={form.difficulty} onChange={set("difficulty")} className={selectCls}>
              {difficultyOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>

          <Field label="Duration (minutes)" htmlFor="field-duration">
            <input id="field-duration" type="number" min={10} value={form.duration} onChange={set("duration")} className={`modal-input ${inputCls(false)}`} placeholder="60" />
          </Field>

          <Field label="Rating (0–5)" htmlFor="field-rating">
            <input id="field-rating" type="number" step="0.1" min={0} max={5} value={form.rating} onChange={set("rating")} className={`modal-input ${inputCls(false)}`} placeholder="4.5" />
          </Field>

          <Field label="Enrolled Students" htmlFor="field-students">
            <input id="field-students" type="number" min={0} value={form.studentsCount} onChange={set("studentsCount")} className={`modal-input ${inputCls(false)}`} placeholder="0" />
          </Field>

          <Field label="Image URL" htmlFor="field-image">
            <input id="field-image" value={form.image} onChange={set("image")} className={`modal-input ${inputCls(false)}`} placeholder="https://..." />
          </Field>

          {/* Actions */}
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <PrimaryBtn className="flex-1" onClick={handleSave}>
              {isEditing ? <><Edit className="h-4 w-4" aria-hidden="true" /> Update Course</> : <><PlusCircle className="h-4 w-4" aria-hidden="true" /> Add Course</>}
            </PrimaryBtn>
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
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
function DeleteModal({ open, onClose, onConfirm, title }) {
  const titleId = "delete-modal-title";
  const descId  = "delete-modal-desc";

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100" aria-hidden="true">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 id={titleId} className="text-lg font-extrabold text-gray-900 mb-1">Delete Course?</h3>
        <p id={descId} className="text-sm text-gray-500 mb-6">
          "<span className="font-semibold text-gray-700">{title}</span>" will be permanently removed from the catalog.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
            style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete Course
          </button>
          <button
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function ManageCourses() {
  const [courses, setCourses]           = useState([...initialCourses]);
  const [search, setSearch]             = useState("");
  const [toast, setToast]               = useState({ text: "", type: "success" });
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingCourse, setEditing]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const notify    = (text, type = "success") => setToast({ text, type });
  const openAdd   = () => { setEditing(null); setModalOpen(true); };
  const openEdit  = (course) => { setEditing(course); setModalOpen(true); };
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
    <div className="min-h-screen bg-[#F4F8FD] text-gray-900">
      <Navbar />

      {/* Toast — aria-live so screen readers announce it */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed top-4 right-4 z-50 pointer-events-none"
      >
        {toast.text && (
          <div className={`pointer-events-auto flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-emerald-50 border border-emerald-200 text-emerald-700"
          }`}>
            {toast.type === "error"
              ? <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              : <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />}
            {toast.text}
          </div>
        )}
      </div>

      <main className="w-full px-4 sm:px-6 py-6 sm:py-10">

        {/* ── Page Header ── */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Manage Courses
          </h1>
          <p className="mt-1 sm:mt-2 text-gray-600 text-sm sm:text-base lg:text-lg font-semibold">
            Add, edit, and organise your course catalog in one place.
          </p>
        </header>

        {/* ── Toolbar ── */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <style>{`#course-search::placeholder { color: #cbd5e1; }`}</style>
            <label htmlFor="course-search" className="sr-only">Search courses</label>
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              id="course-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category…"
              className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/20 focus:border-[#1976D2] transition"
              style={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)" }}
            />
          </div>

          {/* Add Button */}
          <PrimaryBtn onClick={openAdd} className="shrink-0 px-5 py-3 w-full sm:w-auto">
            <PlusCircle className="h-4 w-4" aria-hidden="true" /> Add Course
          </PrimaryBtn>
        </div>

        {/* Count — aria-live so it announces filter changes */}
        <p
          className="mb-4 text-xs text-gray-500 font-medium"
          aria-live="polite"
          aria-atomic="true"
        >
          Showing <span className="text-gray-900 font-bold">{filteredCourses.length}</span> of{" "}
          <span className="text-gray-900 font-bold">{courses.length}</span> courses
        </p>

        {/* ── Grid ── */}
        {filteredCourses.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-gray-300 py-20 text-center text-gray-400"
            role="status"
          >
            <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-40" aria-hidden="true" />
            <p className="font-semibold">No matching courses found.</p>
            <p className="text-xs mt-1 opacity-70">Try a different search or add a new course.</p>
          </div>
        ) : (
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0"
            aria-label="Course catalog"
          >
            {filteredCourses.map((course) => {
              const diff = badge(course.difficulty);
              return (
                <li key={course.id}>
                  <article
                    className="flex flex-col rounded-xl bg-white overflow-hidden h-full"
                    style={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)" }}
                    aria-label={course.title}
                  >
                    {/* Image */}
                    {course.image ? (
                      <img src={course.image} alt="" role="presentation" className="h-40 w-full object-cover" />
                    ) : (
                      <div
                        className="h-40 w-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#1565C0 0%,#1976D2 100%)" }}
                        aria-hidden="true"
                      >
                        <BookOpen className="h-10 w-10 text-white/50" />
                      </div>
                    )}

                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      {/* Difficulty badge */}
                      <span className={`self-start inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${diff.cls}`}>
                        {course.difficulty}
                      </span>

                      {/* Title */}
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2">
                        {course.title}
                      </h2>

                      {/* Short desc */}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{course.shortDescription}</p>

                      {/* Category */}
                      <p className="text-sm text-gray-500 mb-3">
                        <span className="font-semibold text-gray-700">Category:</span> {course.category || "General"}
                      </p>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-[#1976D2]" aria-hidden="true" />
                          <span><span className="sr-only">Duration: </span>{course.duration} min</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4 text-[#1976D2]" aria-hidden="true" />
                          <span><span className="sr-only">Students enrolled: </span>{course.studentsCount?.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                          <span><span className="sr-only">Rating: </span>{course.rating}</span>
                        </span>
                      </div>

                      {/* Edit + Delete */}
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => openEdit(course)}
                          aria-label={`Edit ${course.title}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-1 border-0"
                          style={{ backgroundColor: "#1976D2" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0094c5")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
                        >
                          <Edit className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: course.id, title: course.title })}
                          aria-label={`Delete ${course.title}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
                          style={{ color: "#dc2626", backgroundColor: "#fef2f2", border: "1px solid #fca5a5" }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2"; e.currentTarget.style.borderColor = "#ef4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#fef2f2"; e.currentTarget.style.borderColor = "#fca5a5"; }}
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

      {/* ── Modals ── */}
      <CourseModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
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
      />
    </div>
  );
}
