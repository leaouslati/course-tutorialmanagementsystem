import React, { useEffect, useMemo, useState } from "react";
import {
  PlusCircle, Edit, Trash2, AlertCircle,
  Search as SearchIcon, BookOpen, Clock, Star, User, XCircle,
  AlertTriangle, Layers, ChevronDown, PlayCircle,
} from "lucide-react";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import { authFetch } from "../api";

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
  title: "",
  shortDescription: "",
  description: "",
  category: "Programming",
  difficulty: "Beginner",
  duration: "60",
  rating: "4.5",
  studentsCount: "0",
  image: "",
};


function Field({ label, error, children, htmlFor, labelCol }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        style={{
          display: "block",
          fontSize: 10,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: labelCol,
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs flex items-center gap-1" style={{ color: "#ef4444" }} role="alert">
          <AlertCircle className="h-3 w-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function CourseModal({ open, onClose, onSave, initial, isEditing, darkMode, saving }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});

  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const inputBg = darkMode ? "#0a1628" : "#ffffff";
  const inputText = darkMode ? "#f1f5f9" : "#1f2937";
  const borderCol = darkMode ? "#1a3a6b" : "#e2e8f0";
  const labelCol = darkMode ? "#94a3b8" : "#111827";

  useEffect(() => {
    setForm(initial || emptyForm);
    setErrors({});
  }, [initial, open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: cardBg }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 rounded-t-2xl"
          style={{ background: "linear-gradient(90deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)" }}
        >
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              {isEditing ? "Edit Course" : "Add New Course"}
            </h2>
            <p style={{ fontSize: 12, color: "#bfdbfe", marginTop: 2 }}>
              {isEditing ? "Update the course details below." : "Fill in the details to publish a new course."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <XCircle style={{ width: 28, height: 28 }} strokeWidth={1.8} />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <Field label="Course Title *" error={errors.title} htmlFor="field-title" labelCol={labelCol}>
            <input
              id="field-title"
              value={form.title}
              onChange={set("title")}
              style={inputStyle(errors.title)}
              placeholder="e.g. Complete JavaScript Bootcamp"
            />
          </Field>

          <Field label="Short Description *" error={errors.shortDescription} htmlFor="field-shortDesc" labelCol={labelCol}>
            <input
              id="field-shortDesc"
              value={form.shortDescription}
              onChange={set("shortDescription")}
              style={inputStyle(errors.shortDescription)}
              placeholder="A one-line pitch"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Full Description *" error={errors.description} htmlFor="field-desc" labelCol={labelCol}>
              <textarea
                id="field-desc"
                value={form.description}
                onChange={set("description")}
                style={{ ...inputStyle(errors.description), resize: "none" }}
                rows={2}
                placeholder="Describe what learners will achieve..."
              />
            </Field>
          </div>

          <Field label="Category" htmlFor="field-category" labelCol={labelCol}>
            <select id="field-category" value={form.category} onChange={set("category")} style={inputStyle(false)}>
              {categoryOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>

          <Field label="Difficulty" htmlFor="field-difficulty" labelCol={labelCol}>
            <select id="field-difficulty" value={form.difficulty} onChange={set("difficulty")} style={inputStyle(false)}>
              {difficultyOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>

          <Field label="Duration (minutes)" htmlFor="field-duration" labelCol={labelCol}>
            <input
              id="field-duration"
              type="number"
              min={10}
              value={form.duration}
              onChange={set("duration")}
              style={inputStyle(false)}
              placeholder="60"
            />
          </Field>

          <Field label="Image URL" htmlFor="field-image" labelCol={labelCol}>
            <input
              id="field-image"
              value={form.image}
              onChange={set("image")}
              style={inputStyle(false)}
              placeholder="https://..."
            />
          </Field>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              darkMode={darkMode}
              onClick={handleSave}
              disabled={saving}
              icon={
                saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white inline-block" />
                ) : isEditing ? (
                  <Edit className="h-4 w-4" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )
              }
              className="flex-1 shadow"
            >
              {saving ? (isEditing ? "Updating…" : "Adding…") : isEditing ? "Update Course" : "Add Course"}
            </Button>
            <Button variant="secondary" size="md" darkMode={darkMode} onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ open, onClose, onConfirm, title, darkMode, deleting }) {
  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const headingCol = darkMode ? "#f1f5f9" : "#111827";
  const bodyText = darkMode ? "#cbd5e1" : "#6b7280";
  const nameCol = darkMode ? "#f1f5f9" : "#374151";

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center"
        style={{ backgroundColor: cardBg }}
      >
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: darkMode ? "rgba(239,68,68,0.15)" : "#fee2e2" }}
        >
          <AlertTriangle className="h-6 w-6" style={{ color: "#ef4444" }} />
        </div>
        <h3 className="text-lg font-extrabold mb-1" style={{ color: headingCol }}>
          Delete Course?
        </h3>
        <p className="text-sm mb-6" style={{ color: bodyText }}>
          "<span className="font-semibold" style={{ color: nameCol }}>{title}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <Button
            variant="danger"
            size="md"
            darkMode={darkMode}
            onClick={onConfirm}
            disabled={deleting}
            icon={
              deleting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white inline-block" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )
            }
            className="flex-1"
          >
            {deleting ? "Deleting…" : "Delete Course"}
          </Button>
          <Button variant="secondary" size="md" darkMode={darkMode} onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Module Form Modal ─────────────────────────────────────────────────── */
function ModuleModal({ open, onClose, onSave, courseId, darkMode, saving }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const titleId = "module-modal-title";

  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const inputBg = darkMode ? "#0a1628" : "#ffffff";
  const inputText = darkMode ? "#f1f5f9" : "#1f2937";
  const borderCol = darkMode ? "#1a3a6b" : "#e2e8f0";
  const labelCol = darkMode ? "#94a3b8" : "#111827";

  useEffect(() => {
    setTitle("");
    setError("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    if (!title.trim()) {
      setError("Module title is required.");
      return;
    }
    onSave({ courseId, title });
  };

  const inputStyle = (hasErr) => ({
    backgroundColor: inputBg,
    color: inputText,
    border: `1px solid ${hasErr ? "#ef4444" : borderCol}`,
    width: "100%",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 14,
    outline: "none",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: cardBg }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: "linear-gradient(90deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)" }}
        >
          <div>
            <h2 id={titleId} className="text-lg font-extrabold text-white tracking-tight">
              Add Module
            </h2>
            <p style={{ fontSize: 12, color: "#bfdbfe", marginTop: 2 }}>
              Add a new module to this course.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <XCircle style={{ width: 28, height: 28 }} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 grid gap-3">
          <Field label="Module Title *" error={error} htmlFor="field-module-title" labelCol={labelCol}>
            <input
              id="field-module-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle(!!error)}
              placeholder="e.g. Introduction to JavaScript"
              aria-required="true"
            />
          </Field>
          <div className="flex gap-3 pt-1">
            <Button
              variant="primary"
              size="md"
              darkMode={darkMode}
              onClick={handleSave}
              disabled={saving}
              icon={
                saving
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white inline-block" />
                  : <PlusCircle className="h-4 w-4" />
              }
              className="flex-1 shadow"
            >
              {saving ? "Creating…" : "Add Module"}
            </Button>
            <Button variant="secondary" size="md" darkMode={darkMode} onClick={onClose} disabled={saving} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Lesson Form Modal ─────────────────────────────────────────────────── */
function LessonModal({ open, onClose, onSave, moduleId, darkMode, saving }) {
  const [form, setForm] = useState({ title: "", content: "", duration: "", videoUrl: "" });
  const [errors, setErrors] = useState({});
  const titleId = "lesson-modal-title";

  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const inputBg = darkMode ? "#0a1628" : "#ffffff";
  const inputText = darkMode ? "#f1f5f9" : "#1f2937";
  const borderCol = darkMode ? "#1a3a6b" : "#e2e8f0";
  const labelCol = darkMode ? "#94a3b8" : "#111827";

  useEffect(() => {
    setForm({ title: "", content: "", duration: "", videoUrl: "" });
    setErrors({});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Lesson title is required.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({ moduleId, ...form, duration: Number(form.duration) });
  };

  const inputStyle = (hasErr) => ({
    backgroundColor: inputBg,
    color: inputText,
    border: `1px solid ${hasErr ? "#ef4444" : borderCol}`,
    width: "100%",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 14,
    outline: "none",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: cardBg }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: "linear-gradient(90deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)" }}
        >
          <div>
            <h2 id={titleId} className="text-lg font-extrabold text-white tracking-tight">
              Add Lesson
            </h2>
            <p style={{ fontSize: 12, color: "#bfdbfe", marginTop: 2 }}>
              Add a new lesson to this module.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            <XCircle style={{ width: 28, height: 28 }} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Lesson Title *" error={errors.title} htmlFor="field-lesson-title" labelCol={labelCol}>
              <input
                id="field-lesson-title"
                value={form.title}
                onChange={set("title")}
                style={inputStyle(!!errors.title)}
                placeholder="e.g. Variables and Data Types"
                aria-required="true"
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Content" htmlFor="field-lesson-content" labelCol={labelCol}>
              <textarea
                id="field-lesson-content"
                value={form.content}
                onChange={set("content")}
                style={{ ...inputStyle(false), resize: "none" }}
                rows={2}
                placeholder="Lesson description or notes..."
              />
            </Field>
          </div>

          <Field label="Duration (minutes)" htmlFor="field-lesson-duration" labelCol={labelCol}>
            <input
              id="field-lesson-duration"
              type="number"
              min={1}
              value={form.duration}
              onChange={set("duration")}
              style={inputStyle(false)}
              placeholder="10"
            />
          </Field>

          <Field label="Video URL" htmlFor="field-lesson-video" labelCol={labelCol}>
            <input
              id="field-lesson-video"
              value={form.videoUrl}
              onChange={set("videoUrl")}
              style={inputStyle(false)}
              placeholder="https://youtube.com/..."
            />
          </Field>

          <div className="sm:col-span-2 flex gap-3 pt-1">
            <Button
              variant="primary"
              size="md"
              darkMode={darkMode}
              onClick={handleSave}
              disabled={saving}
              icon={
                saving
                  ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white inline-block" />
                  : <PlusCircle className="h-4 w-4" />
              }
              className="flex-1 shadow"
            >
              {saving ? "Creating…" : "Add Lesson"}
            </Button>
            <Button variant="secondary" size="md" darkMode={darkMode} onClick={onClose} disabled={saving} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Modules Panel Modal ───────────────────────────────────────────────── */
function ModulesModal({ open, onClose, course, modules, lessons, onAddModuleClick, onAddLessonClick, darkMode }) {
  const titleId = "modules-modal-title";
  const [expandedModuleId, setExpandedModuleId] = useState(null);

  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const rowBg = darkMode ? "#0a1628" : "#f8fafc";
  const rowBorder = darkMode ? "#1a3a6b" : "#e2e8f0";
  const lessonsBg = darkMode ? "#060f1e" : "#f1f5f9";
  const headingCol = darkMode ? "#f1f5f9" : "#1f2937";
  const mutedCol = darkMode ? "#64748b" : "#9ca3af";
  const emptyCol = darkMode ? "#475569" : "#9ca3af";
  const lessonText = darkMode ? "#94a3b8" : "#4b5563";

  // Reset expanded state when modal opens
  useEffect(() => { if (open) setExpandedModuleId(null); }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const moduleList = modules || [];

  const toggleModule = (id) => setExpandedModuleId((prev) => (prev === id ? null : id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: cardBg }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(90deg,#0D47A1 0%,#1565C0 60%,#1976D2 100%)" }}
        >
          <div>
            <h2 id={titleId} className="text-base font-extrabold text-white tracking-tight leading-snug">
              {course?.title}
            </h2>
            <p style={{ fontSize: 12, color: "#bfdbfe", marginTop: 2 }}>
              {moduleList.length} module{moduleList.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "rgba(255,255,255,0.85)", display: "flex" }}
          >
            <XCircle style={{ width: 26, height: 26 }} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        {/* Module list */}
        <div className="p-4 max-h-[28rem] overflow-y-auto">
          {moduleList.length === 0 ? (
            <div className="py-10 text-center">
              <Layers className="mx-auto mb-3 h-8 w-8 opacity-30" style={{ color: emptyCol }} aria-hidden="true" />
              <p className="text-sm font-semibold" style={{ color: emptyCol }}>No modules yet</p>
              <p className="text-xs mt-1 opacity-70" style={{ color: emptyCol }}>Add the first module to get started.</p>
            </div>
          ) : (
            <ul className="space-y-2 list-none p-0">
              {moduleList.map((mod, idx) => {
                const modLessons = lessons[mod.id] || [];
                const isExpanded = expandedModuleId === mod.id;
                return (
                  <li
                    key={mod.id}
                    className="rounded-xl overflow-hidden"
                    style={{ border: `1px solid ${rowBorder}` }}
                  >
                    {/* Module header row */}
                    <div
                      className="flex items-center gap-3 px-4 py-3"
                      style={{ backgroundColor: rowBg }}
                    >
                      {/* Clickable area — toggles lessons */}
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="flex-1 text-left min-w-0"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                        aria-expanded={isExpanded}
                      >
                        <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: mutedCol }}>
                          Module {idx + 1}
                        </p>
                        <p className="text-sm font-semibold leading-snug truncate" style={{ color: headingCol }}>
                          {mod.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: mutedCol }}>
                          {modLessons.length > 0
                            ? `${modLessons.length} lesson${modLessons.length !== 1 ? "s" : ""} — click to ${isExpanded ? "hide" : "view"}`
                            : "No lessons yet"}
                        </p>
                      </button>

                      {/* Chevron toggle */}
                      <button
                        onClick={() => toggleModule(mod.id)}
                        aria-label={isExpanded ? "Collapse lessons" : "Expand lessons"}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: mutedCol, display: "flex", flexShrink: 0 }}
                      >
                        <ChevronDown
                          className="h-4 w-4 transition-transform duration-200"
                          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                          aria-hidden="true"
                        />
                      </button>

                      {/* Add lesson button */}
                      <button
                        onClick={() => onAddLessonClick(mod.id)}
                        className="shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: darkMode ? "rgba(25,118,210,0.15)" : "#dbeafe",
                          color: darkMode ? "#60a5fa" : "#1d4ed8",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Lesson
                      </button>
                    </div>

                    {/* Lessons dropdown */}
                    {isExpanded && (
                      <div style={{ backgroundColor: lessonsBg }}>
                        {modLessons.length === 0 ? (
                          <p
                            className="px-5 py-3 text-xs italic"
                            style={{ color: emptyCol }}
                          >
                            No lessons added yet. Click "+ Lesson" to add one.
                          </p>
                        ) : (
                          <ul className="list-none p-0 divide-y" style={{ borderColor: rowBorder }}>
                            {modLessons.map((lesson, lIdx) => (
                              <li
                                key={lesson.id}
                                className="flex items-start gap-3 px-5 py-2.5"
                              >
                                <PlayCircle
                                  className="h-3.5 w-3.5 mt-0.5 shrink-0"
                                  style={{ color: "#1976D2" }}
                                  aria-hidden="true"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold leading-snug" style={{ color: lessonText }}>
                                    {lIdx + 1}. {lesson.title}
                                  </p>
                                  {lesson.duration > 0 && (
                                    <p className="text-xs mt-0.5" style={{ color: mutedCol }}>
                                      {lesson.duration} min
                                    </p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 flex gap-3"
          style={{ borderTop: `1px solid ${rowBorder}` }}
        >
          <Button
            variant="primary"
            size="sm"
            darkMode={darkMode}
            onClick={onAddModuleClick}
            icon={<PlusCircle className="h-3.5 w-3.5" />}
            className="flex-1"
          >
            Add Module
          </Button>
          <Button variant="secondary" size="sm" darkMode={darkMode} onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ManageCourses({ darkMode = false }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ text: "", type: "success" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [modules, setModules] = useState({});
  const [lessons, setLessons] = useState({});
  const [moduleModalCourseId, setModuleModalCourseId] = useState(null);
  const [lessonModalModuleId, setLessonModalModuleId] = useState(null);
  const [contentPanelCourse, setContentPanelCourse] = useState(null);
  const [moduleSaving, setModuleSaving] = useState(false);
  const [lessonSaving, setLessonSaving] = useState(false);

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

  const notify = (text, type = "success") => setToast({ text, type });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await authFetch("/api/courses?instructorId=me");
        const data = await res.json();
        const courseList = Array.isArray(data) ? data : [];
        setCourses(courseList);

        // Fetch existing modules and lessons for each course so they show on load
        const moduleMap = {};
        const lessonMap = {};
        await Promise.all(
          courseList.map(async (c) => {
            try {
              const r = await authFetch(`/api/courses/${c.id}`);
              const d = await r.json();
              if (Array.isArray(d.modules)) {
                moduleMap[c.id] = d.modules;
                d.modules.forEach((mod) => {
                  if (Array.isArray(mod.lessons)) lessonMap[mod.id] = mod.lessons;
                });
              }
            } catch {
              // non-fatal — course card still renders without modules
            }
          })
        );
        setModules(moduleMap);
        setLessons(lessonMap);
      } catch {
        notify("Failed to load courses", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter((c) =>
      [c.title, c.shortDescription, c.category].join(" ").toLowerCase().includes(q)
    );
  }, [courses, search]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const saveCourse = async (form) => {
    setSaving(true);
    try {
      if (editingCourse) {
        const res = await authFetch(`/api/courses/${editingCourse.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        if (!res.ok) throw new Error(updated.error || updated.message || "Failed to update course");
        setCourses((p) => p.map((c) => (c.id === editingCourse.id ? updated : c)));
        notify("Course updated successfully.");
      } else {
        const res = await authFetch("/api/courses", {
          method: "POST",
          body: JSON.stringify(form),
        });
        const created = await res.json();
        if (!res.ok) throw new Error(created.error || created.message || "Failed to create course");
        setCourses((p) => [created, ...p]);
        notify("Course added to the catalog.");
      }
      closeModal();
    } catch (err) {
      notify(err.message || "Operation failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await authFetch(`/api/courses/${deleteTarget.id}`, { method: "DELETE" });
      setCourses((p) => p.filter((c) => c.id !== deleteTarget.id));
      notify("Course removed from catalog.");
      setDeleteTarget(null);
    } catch {
      notify("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleAddModule = async ({ courseId, title }) => {
    setModuleSaving(true);
    try {
      const res = await authFetch("/api/modules", {
        method: "POST",
        body: JSON.stringify({ courseId, title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to add module");
      setModules((prev) => ({ ...prev, [courseId]: [...(prev[courseId] || []), data] }));
      setModuleModalCourseId(null);
      notify("Module added successfully.");
    } catch (err) {
      notify(err.message || "Failed to add module.", "error");
    } finally {
      setModuleSaving(false);
    }
  };

  const handleAddLesson = async ({ moduleId, title, content, duration, videoUrl }) => {
    setLessonSaving(true);
    try {
      const res = await authFetch("/api/lessons", {
        method: "POST",
        body: JSON.stringify({ moduleId, title, content, duration, videoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Failed to add lesson");
      setLessons((prev) => ({ ...prev, [moduleId]: [...(prev[moduleId] || []), data] }));
      setLessonModalModuleId(null);
      notify("Lesson added successfully.");
    } catch (err) {
      notify(err.message || "Failed to add lesson.", "error");
    } finally {
      setLessonSaving(false);
    }
  };

  if (loading) return <LoadingSpinner darkMode={darkMode} message="Loading courses…" fullPage />;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: pageBg }}>
      <Toast
        message={toast.text}
        type={toast.type}
        onClose={() => setToast({ text: "", type: "success" })}
        darkMode={darkMode}
      />

      <main className="w-full px-4 sm:px-6 py-6 sm:py-10">
        <header className="mb-6 sm:mb-8">
          <h1
            className="font-extrabold tracking-tight leading-tight"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.25rem)", color: headingCol }}
          >
            Manage Courses
          </h1>
          <p
            className="mt-1 sm:mt-2 font-semibold"
            style={{ fontSize: "clamp(0.8rem, 2.5vw, 1.1rem)", color: subCol }}
          >
            Add, edit, and organise your course catalog in one place.
          </p>
        </header>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1">
            <SearchIcon
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: mutedCol }}
              aria-hidden="true"
            />
            <input
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

          <Button
            variant="primary"
            size="lg"
            darkMode={darkMode}
            onClick={openAdd}
            icon={<PlusCircle className="h-4 w-4" />}
            className="shrink-0 w-full sm:w-auto shadow"
          >
            Add Course
          </Button>
        </div>

        <p className="mb-4 text-xs font-medium" style={{ color: countText }} aria-live="polite" aria-atomic="true">
          Showing <span className="font-bold" style={{ color: headingCol }}>{filteredCourses.length}</span> of{" "}
          <span className="font-bold" style={{ color: headingCol }}>{courses.length}</span> courses
        </p>

        {filteredCourses.length === 0 ? (
          <div
            className="rounded-2xl border-dashed py-20 text-center"
            style={{
              border: `1px dashed ${darkMode ? "#1a3a6b" : "#d1d5db"}`,
              color: mutedCol,
            }}
            role="status"
          >
            <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-40" aria-hidden="true" />
            <p className="font-semibold">{search ? "No matching courses found." : "No courses yet."}</p>
            <p className="text-xs mt-1 opacity-70">
              {search ? "Try a different search or add a new course." : "Start by adding your first course."}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0" aria-label="Course catalog">
            {filteredCourses.map((course) => {
              const diff = badge(course.difficulty, darkMode);
              return (
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
                        : "0 20px 25px -5px rgba(0,0,0,0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = darkMode
                        ? "none"
                        : "0 2px 12px 0 rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    aria-label={course.title}
                  >
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
                      <span className={`self-start inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${diff}`}>
                        {course.difficulty}
                      </span>

                      <h2 className="text-base sm:text-lg font-bold leading-snug line-clamp-2 mb-2" style={{ color: headingCol }}>
                        {course.title}
                      </h2>

                      <p className="text-sm line-clamp-2 mb-2" style={{ color: bodyText }}>
                        {course.shortDescription}
                      </p>

                      <p className="text-sm mb-3" style={{ color: subCol }}>
                        <span className="font-semibold" style={{ color: darkMode ? "#f1f5f9" : "#374151" }}>
                          Category:
                        </span>{" "}
                        {course.category || "General"}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm" style={{ color: subCol }}>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" style={{ color: "#1976D2" }} aria-hidden="true" />
                          {course.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" style={{ color: "#1976D2" }} aria-hidden="true" />
                          {course.studentsCount?.toLocaleString()}
                        </span>
                        {course.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" style={{ color: "#facc15", fill: "#facc15" }} aria-hidden="true" />
                            {course.rating}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <Button
                          variant="primary"
                          size="sm"
                          darkMode={darkMode}
                          onClick={() => openEdit(course)}
                          aria-label={`Edit ${course.title}`}
                          icon={<Edit className="h-3.5 w-3.5" />}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger-soft"
                          size="sm"
                          darkMode={darkMode}
                          onClick={() => setDeleteTarget({ id: course.id, title: course.title })}
                          aria-label={`Delete ${course.title}`}
                          icon={<Trash2 className="h-3.5 w-3.5" />}
                          className="flex-1"
                        >
                          Delete
                        </Button>
                      </div>

                      {/* Opens the modules popup */}
                      <button
                        onClick={() => setContentPanelCourse(course)}
                        className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-colors"
                        style={{
                          backgroundColor: darkMode ? "#0a1628" : "#f1f5f9",
                          color: darkMode ? "#94a3b8" : "#374151",
                          border: `1px solid ${darkMode ? "#1a3a6b" : "#e2e8f0"}`,
                          cursor: "pointer",
                        }}
                        aria-label={`Manage content for ${course.title}`}
                      >
                        <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                        {(modules[course.id] || []).length > 0
                          ? `${(modules[course.id] || []).length} Module${(modules[course.id] || []).length !== 1 ? "s" : ""} — Manage`
                          : "Manage Content"}
                      </button>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <CourseModal
        open={modalOpen}
        onClose={closeModal}
        onSave={saveCourse}
        darkMode={darkMode}
        saving={saving}
        initial={
          editingCourse
            ? { ...editingCourse, duration: editingCourse.duration?.toString(), image: editingCourse.image || "" }
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
        deleting={deleting}
      />

      {/* Modules panel — opens from the card's "Manage Content" button */}
      <ModulesModal
        open={!!contentPanelCourse}
        onClose={() => setContentPanelCourse(null)}
        course={contentPanelCourse}
        modules={modules[contentPanelCourse?.id] || []}
        lessons={lessons}
        onAddModuleClick={() => setModuleModalCourseId(contentPanelCourse?.id)}
        onAddLessonClick={(moduleId) => setLessonModalModuleId(moduleId)}
        darkMode={darkMode}
      />

      <ModuleModal
        open={!!moduleModalCourseId}
        onClose={() => { if (!moduleSaving) setModuleModalCourseId(null); }}
        onSave={handleAddModule}
        courseId={moduleModalCourseId}
        darkMode={darkMode}
        saving={moduleSaving}
      />

      <LessonModal
        open={!!lessonModalModuleId}
        onClose={() => { if (!lessonSaving) setLessonModalModuleId(null); }}
        onSave={handleAddLesson}
        moduleId={lessonModalModuleId}
        darkMode={darkMode}
        saving={lessonSaving}
      />
    </div>
  );
}