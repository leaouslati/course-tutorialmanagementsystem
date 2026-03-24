import React, { useEffect, useMemo, useState } from "react";
import { courses as initialCourses } from "../data/mockdata";
import {
  PlusCircle, Edit, Trash2, CheckCircle, AlertCircle,
  Search as SearchIcon, BookOpen, Clock, Star, User, XCircle,
  AlertTriangle,
} from "lucide-react";

/* Options */
const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];
const categoryOptions = ["Programming", "Web Development", "Design", "Mathematics", "Language"];

/* Difficulty badge */
const badge = (difficulty) => {
  const map = {
    Beginner:     { cls: "bg-green-900/40 text-green-300" },
    Intermediate: { cls: "bg-yellow-900/40 text-yellow-300" },
    Advanced:     { cls: "bg-red-900/40 text-red-300" },
  };
  return map[difficulty] || { cls: "bg-slate-700 text-slate-300" };
};

/* Button */
const PrimaryBtn = ({ onClick, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 ${className}`}
    style={{ backgroundColor: "#1976D2" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1565C0")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
  >
    {children}
  </button>
);

export default function ManageCourses() {
  const [courses, setCourses] = useState([...initialCourses]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ text: "", type: "success" });

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter((c) =>
      [c.title, c.shortDescription, c.category]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [courses, search]);

  useEffect(() => {
    if (!toast.text) return;
    const t = setTimeout(() => setToast({ text: "", type: "success" }), 2800);
    return () => clearTimeout(t);
  }, [toast.text]);

  const notify = (text, type = "success") => setToast({ text, type });

  return (
    <div className="min-h-screen bg-[#0d1b2e] text-gray-100">

      {/* Toast */}
      <div className="fixed top-4 right-4 z-50">
        {toast.text && (
          <div className={`flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium shadow-lg ${
            toast.type === "error"
              ? "bg-red-900/40 text-red-300"
              : "bg-emerald-900/40 text-emerald-300"
          }`}>
            {toast.type === "error"
              ? <AlertCircle className="h-4 w-4" />
              : <CheckCircle className="h-4 w-4" />}
            {toast.text}
          </div>
        )}
      </div>

      <main className="w-full px-6 py-10">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white">
            Manage Courses
          </h1>
          <p className="mt-2 text-blue-200 font-semibold">
            Add, edit, and organise your course catalog in one place.
          </p>
        </header>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">

          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category…"
              className="w-full rounded-xl bg-[#1f2937] border border-gray-700 pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
            />
          </div>

          {/* Add Button */}
          <PrimaryBtn>
            <PlusCircle className="h-4 w-4" />
            Add Course
          </PrimaryBtn>
        </div>

        {/* Count */}
        <p className="mb-6 text-sm text-gray-400">
          Showing <span className="font-bold text-white">{filteredCourses.length}</span> of{" "}
          <span className="font-bold text-white">{courses.length}</span> courses
        </p>

        {/* Grid */}
        {filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-gray-700 py-20 text-center text-gray-400">
            <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-40" />
            <p className="font-semibold">No matching courses found.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0">
            {filteredCourses.map((course) => {
              const diff = badge(course.difficulty);
              return (
                <li key={course.id}>
                  <article className="flex flex-col rounded-xl bg-[#1f2937] overflow-hidden shadow-lg">

                    {/* Image */}
                    {course.image ? (
                      <img src={course.image} alt="" className="h-40 w-full object-cover" />
                    ) : (
                      <div className="h-40 w-full flex items-center justify-center bg-gradient-to-br from-[#1565C0] to-[#1976D2]">
                        <BookOpen className="h-10 w-10 text-white/40" />
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">

                      <span className={`self-start inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3 ${diff.cls}`}>
                        {course.difficulty}
                      </span>

                      <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {course.title}
                      </h2>

                      <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                        {course.shortDescription}
                      </p>

                      <p className="text-sm text-gray-400 mb-4">
                        <span className="font-semibold text-gray-300">Category:</span> {course.category}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-[#1976D2]" />
                          {course.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4 text-[#1976D2]" />
                          {course.studentsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          {course.rating}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <button
                          className="flex-1 text-white rounded-lg px-3 py-2 text-xs font-semibold"
                          style={{ backgroundColor: "#1976D2" }}
                        >
                          <Edit className="h-3.5 w-3.5 inline mr-1" />
                          Edit
                        </button>

                        <button
                          className="flex-1 rounded-lg px-3 py-2 text-xs font-semibold border border-red-400 text-red-400 hover:bg-red-900/30"
                        >
                          <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                          Delete
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
    </div>
  );
}