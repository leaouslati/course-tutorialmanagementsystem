import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { courses, users, modules } from "../data/mockdata";
import { useState } from "react";
import {
  Mail, Calendar, User, Users, Edit2, Eye, EyeOff, Lock, X, Flame, CreditCard,
  BookOpen, TrendingUp, Layers, BarChart2, ArrowRight,
  Star, Zap, Target, Shield, Award, Clock, PlusCircle
} from "lucide-react";

const mockUser = users[0];

const getLevelByProgress = (avg) =>
  avg >= 80 ? { label: "Expert", colorClass: "text-rose-500", bgClass: "bg-rose-50", hex: "#f43f5e" } :
  avg >= 50 ? { label: "Advanced", colorClass: "text-purple-600", bgClass: "bg-purple-50", hex: "#9333ea" } :
  avg >= 20 ? { label: "Intermediate", colorClass: "text-amber-500", bgClass: "bg-amber-50", hex: "#f59e0b" } :
  { label: "Beginner", colorClass: "text-green-600", bgClass: "bg-green-50", hex: "#22c55e" };

const getInstructorExperience = (created) =>
  created >= 5 ? { label: "Expert Instructor", colorClass: "text-rose-500", bgClass: "bg-rose-50", hex: "#f43f5e" } :
  created >= 3 ? { label: "Established Instructor", colorClass: "text-purple-600", bgClass: "bg-purple-50", hex: "#9333ea" } :
  created >= 1 ? { label: "Rising Instructor", colorClass: "text-amber-500", bgClass: "bg-amber-50", hex: "#f59e0b" } :
  { label: "New Instructor", colorClass: "text-green-600", bgClass: "bg-green-50", hex: "#22c55e" };

const blueBtn = {
  base: "rounded-xl py-2.5 text-sm font-semibold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2",
  style: { backgroundColor: "#1976D2" },
  onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = "#1565C0"),
  onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = "#1976D2"),
};

const studentBadges = (finished, enrolled, avg) => [
  { icon: <BookOpen className="w-6 h-6 text-[#1976D2]" />, bg: "bg-blue-50", border: "border-blue-200", title: "First Enrollment", desc: "Enrolled in your first course", earned: enrolled >= 1 },
  { icon: <Award className="w-6 h-6 text-amber-500" />, bg: "bg-amber-50", border: "border-amber-200", title: "Course Completer", desc: "Finished at least one course", earned: finished >= 1 },
  { icon: <TrendingUp className="w-6 h-6 text-green-500" />, bg: "bg-green-50", border: "border-green-200", title: "Overachiever", desc: "Completed 3+ courses", earned: finished >= 3 },
  { icon: <Target className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50", border: "border-purple-200", title: "Halfway There", desc: "Average progress above 50%", earned: avg >= 50 },
  { icon: <Zap className="w-6 h-6 text-yellow-500" />, bg: "bg-yellow-50", border: "border-yellow-200", title: "Fast Learner", desc: "Enrolled in 5+ courses", earned: enrolled >= 5 },
  { icon: <Star className="w-6 h-6 text-rose-500" />, bg: "bg-rose-50", border: "border-rose-200", title: "Top Student", desc: "Average progress above 80%", earned: avg >= 80 },
];

const instructorBadges = (created, totalLessons) => [
  { icon: <PlusCircle className="w-6 h-6 text-[#1976D2]" />, bg: "bg-blue-50", border: "border-blue-200", title: "Course Creator", desc: "Published your first course", earned: created >= 1 },
  { icon: <Layers className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50", border: "border-purple-200", title: "Dedicated Teacher", desc: "Created 3+ courses", earned: created >= 3 },
  { icon: <Shield className="w-6 h-6 text-green-500" />, bg: "bg-green-50", border: "border-green-200", title: "Content Master", desc: "Published 20+ lessons", earned: totalLessons >= 20 },
  { icon: <Star className="w-6 h-6 text-amber-500" />, bg: "bg-amber-50", border: "border-amber-200", title: "Expert Instructor", desc: "Created 5+ courses", earned: created >= 5 },
];

function IDCardModal({ user, subtitle, idPrefix, badge, stats, onClose }) {
  const joined = user.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Unknown";
  const idNumber = `${idPrefix}-${user.id?.toUpperCase().replace("U", "").padStart(4, "0") ?? "0000"}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={subtitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
          <div className="h-20 bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#1976D2] flex items-center px-5 gap-3">
            <BookOpen className="w-6 h-6 text-white/80" aria-hidden="true" />
            <div>
              <p className="text-white font-extrabold text-base tracking-wide leading-tight">CourseHub</p>
              <p className="text-blue-200 text-xs font-medium">{subtitle}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-blue-200 text-[10px] uppercase tracking-widest">ID</p>
              <p className="text-white font-bold text-sm">{idNumber}</p>
            </div>
          </div>

          <div className="px-5 py-5 flex items-start gap-4">
            <div
              aria-hidden="true"
              className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#E3F2FD] flex items-center justify-center border-2 border-[#1976D2]/20"
            >
              <span className="text-2xl font-extrabold text-[#1976D2]">{user.name?.charAt(0)?.toUpperCase() ?? "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">{user.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: badge.hex }}
                >
                  {badge.label}
                </span>
                <span className="text-xs text-slate-400">· Since {joined}</span>
              </div>
            </div>
          </div>

          <div
            className="grid border-t border-slate-100"
            style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
            role="list"
            aria-label="Statistics"
          >
            {stats.map(({ label, value, color }) => (
              <div key={label} className="py-4 text-center" role="listitem">
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className={`${blueBtn.base} px-6 w-full`}
          style={blueBtn.style}
          onMouseEnter={blueBtn.onMouseEnter}
          onMouseLeave={blueBtn.onMouseLeave}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function EditModal({ user, onClose }) {
  const [tab, setTab] = useState("info");
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleInfoSave = () => {
    user.name = name;
    user.email = email;
    setInfoSuccess(true);
    setTimeout(() => {
      setInfoSuccess(false);
      onClose();
    }, 1200);
  };

  const handlePasswordSave = () => {
    setPwError("");
    if (!currentPw || !newPw || !confirmPw) {
      setPwError("All fields are required.");
      return;
    }
    if (currentPw !== user.password) {
      setPwError("Current password is incorrect.");
      return;
    }
    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }
    user.password = newPw;
    setPwSuccess(true);
    setTimeout(() => {
      setPwSuccess(false);
      onClose();
    }, 1200);
  };

  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      role="tab"
      aria-selected={tab === id}
      aria-controls={`tabpanel-${id}`}
      className="flex-1 py-2 rounded-lg text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-1"
      style={tab === id ? { backgroundColor: "#1976D2", color: "#fff" } : { backgroundColor: "#F4F8FD", color: "#64748b" }}
      onMouseEnter={(e) => {
        if (tab !== id) e.currentTarget.style.backgroundColor = "#E3F2FD";
      }}
      onMouseLeave={(e) => {
        if (tab !== id) e.currentTarget.style.backgroundColor = "#F4F8FD";
      }}
    >
      {label}
    </button>
  );

  const PwField = ({ id, label, value, onChange, show, onToggle, placeholder }) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={id === "current-password" ? "current-password" : "new-password"}
          className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1976D2] transition"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] rounded"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Account Settings"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Account Settings</h2>
          <button
            onClick={onClose}
            aria-label="Close account settings"
            className="rounded-lg p-1.5 hover:bg-slate-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div role="tablist" aria-label="Settings sections" className="flex gap-2 px-5 sm:px-6 py-4 border-b border-slate-100">
          <TabBtn id="info" label="Profile Info" />
          <TabBtn id="password" label="Change Password" />
        </div>

        <div className="px-5 sm:px-6 py-6">
          <div id="tabpanel-info" role="tabpanel" hidden={tab !== "info"}>
            {tab === "info" && (
              <div className="flex flex-col gap-4">
                {[
                  { lbl: "Full Name", val: name, setter: setName, type: "text", ph: "Your full name", id: "edit-name" },
                  { lbl: "Email", val: email, setter: setEmail, type: "email", ph: "your@email.com", id: "edit-email" },
                ].map(({ lbl, val, setter, type, ph, id }) => (
                  <div key={id} className="flex flex-col gap-1">
                    <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{lbl}</label>
                    <input
                      id={id}
                      value={val}
                      onChange={(e) => setter(e.target.value)}
                      type={type}
                      placeholder={ph}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1976D2] transition"
                    />
                  </div>
                ))}
                {infoSuccess && (
                  <p role="status" className="text-xs text-green-600 font-medium">Profile updated successfully!</p>
                )}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInfoSave}
                    className={`flex-1 ${blueBtn.base}`}
                    style={blueBtn.style}
                    onMouseEnter={blueBtn.onMouseEnter}
                    onMouseLeave={blueBtn.onMouseLeave}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>

          <div id="tabpanel-password" role="tabpanel" hidden={tab !== "password"}>
            {tab === "password" && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-slate-500">Password must be at least 8 characters with a mix of letters and numbers.</p>
                <PwField id="current-password" label="Current Password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} placeholder="Enter current password" />
                <PwField id="new-password" label="New Password" value={newPw} onChange={(e) => setNewPw(e.target.value)} show={showNew} onToggle={() => setShowNew(!showNew)} placeholder="Enter new password" />
                <PwField id="confirm-password" label="Confirm New Password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} placeholder="Confirm new password" />
                {pwError && <p role="alert" className="text-xs text-red-500 font-medium">{pwError}</p>}
                {pwSuccess && <p role="status" className="text-xs text-green-600 font-medium">Password updated successfully!</p>}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSave}
                    className={`flex-1 ${blueBtn.base}`}
                    style={blueBtn.style}
                    onMouseEnter={blueBtn.onMouseEnter}
                    onMouseLeave={blueBtn.onMouseLeave}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ icon, title, desc, earned, bg, border }) {
  return (
    <article
      aria-label={`${title} badge – ${earned ? "earned" : "locked"}`}
      className={`rounded-xl border-2 p-4 flex items-start gap-3 sm:gap-4 transition-all duration-200 ${
        earned ? `bg-white ${border} shadow-sm` : "bg-slate-50 border-dashed border-slate-200 opacity-50 grayscale"
      }`}
    >
      <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${earned ? bg : "bg-slate-100"}`} aria-hidden="true">
        <span className="[&>svg]:w-7 [&>svg]:h-7 sm:[&>svg]:w-8 sm:[&>svg]:h-8">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          {earned && (
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap">Earned</span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        {!earned && <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Locked</span>}
      </div>
    </article>
  );
}

function QuickAction({ to, icon, label, sub, onClick }) {
  const inner = (
    <>
      <div
        aria-hidden="true"
        className="w-10 h-10 rounded-xl bg-[#E3F2FD] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1976D2] transition-colors duration-200"
      >
        <span className="text-[#1976D2] group-hover:text-white transition-colors duration-200">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <ArrowRight aria-hidden="true" className="w-4 h-4 text-slate-300 group-hover:text-[#1976D2] transition-colors duration-200 flex-shrink-0" />
    </>
  );

  const cls = "group rounded-xl border border-slate-200 shadow-sm p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:border-[#1976D2] hover:shadow-md transition-all duration-200 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2";

  return to ? (
    <Link to={to} className={`${cls} bg-white`} aria-label={label} style={{ display: "flex" }}>
      {inner}
    </Link>
  ) : (
    <button onClick={onClick} className={cls} aria-label={label} style={{ backgroundColor: "white", borderRadius: "0.75rem" }}>
      {inner}
    </button>
  );
}

function Profile() {
  const [currentUser] = useState(mockUser);
  const [showModal, setShowModal] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [showInstructorIDCard, setShowInstructorIDCard] = useState(false);
  const isInstructor = currentUser.role === "instructor";

  const enrolledCourses = Array.isArray(currentUser.enrolledCourses)
    ? courses.filter((c) => currentUser.enrolledCourses.includes(c.id))
    : [];
  const createdCourses = courses.filter((c) => c.instructorId === currentUser.id);

  const countCourseLessons = (course) =>
    Array.isArray(course.modules)
      ? course.modules.reduce((acc, modId) => acc + (modules.find((m) => m.id === modId)?.lessons.length || 0), 0)
      : 0;

  const computeProgress = (course) => currentUser.progress?.[course.id] ?? 0;

  const enrolledCount = enrolledCourses.length;
  const createdCount = createdCourses.length;
  const finishedCourses = enrolledCourses.filter((c) => computeProgress(c) === 100).length;
  const averageProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((s, c) => s + computeProgress(c), 0) / enrolledCourses.length)
    : 0;
  const totalModules = createdCourses.reduce((acc, c) => acc + (Array.isArray(c.modules) ? c.modules.length : 0), 0);
  const totalLessons = createdCourses.reduce((acc, c) => acc + countCourseLessons(c), 0);
  const totalStudents = createdCourses.reduce((acc, c) => acc + (c.studentsCount || 0), 0);
  const avgRating = createdCourses.length > 0
    ? (createdCourses.reduce((acc, c) => acc + (c.rating || 0), 0) / createdCourses.length).toFixed(1)
    : "—";
  const progressValue = isInstructor ? Math.min(createdCount * 18, 100) : averageProgress;
  const completedHours = enrolledCourses.reduce((s, c) => s + (computeProgress(c) * c.duration) / 100, 0).toFixed(1);

  const badges = isInstructor
    ? instructorBadges(createdCount, totalLessons)
    : studentBadges(finishedCourses, enrolledCount, averageProgress);
  const earnedCount = badges.filter((b) => b.earned).length;
  const lvl = getLevelByProgress(averageProgress);
  const exp = getInstructorExperience(createdCount);

  return (
    <div className="w-screen min-h-screen bg-[#F4F8FD] text-slate-800">
      <Navbar isLoggedIn={Boolean(currentUser)} />

      <main className="w-full min-h-screen px-3 sm:px-4 lg:px-6 py-6 flex flex-col items-center gap-6 sm:gap-8">
        <section
          aria-label="Profile overview"
          className="w-full max-w-5xl rounded-2xl bg-white shadow-md border border-slate-200 overflow-hidden"
        >
          <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-5">
              <div
                aria-hidden="true"
                className="flex-shrink-0 h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[#E3F2FD] flex items-center justify-center"
              >
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1976D2]">
                  {currentUser.name?.charAt(0)?.toUpperCase() ?? "U"}
                </span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{currentUser.name}</h1>
                <span className="inline-flex rounded-full bg-[#FCD34D] px-3 py-0.5 text-xs font-bold capitalize text-slate-800 mt-1">
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              aria-label="Edit your profile"
              className="self-start sm:self-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2"
              style={{ backgroundColor: "#1976D2" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1565C0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
            >
              <Edit2 className="h-4 w-4" aria-hidden="true" /> Edit Profile
            </button>
          </div>

          <dl className="px-5 sm:px-8 pb-6 sm:pb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t-2 border-slate-200 pt-5">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#1976D2] flex-shrink-0" aria-hidden="true" />
              <dt className="sr-only">Email</dt>
              <dd className="text-sm text-slate-700 truncate">{currentUser.email}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#1976D2] flex-shrink-0" aria-hidden="true" />
              <dt className="sr-only">Joined date</dt>
              <dd className="text-sm text-slate-700">
                Joined: {currentUser.joinedDate
                  ? new Date(currentUser.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                  : "Unknown"}
              </dd>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#1976D2] flex-shrink-0" aria-hidden="true" />
              <dt className="sr-only">Role</dt>
              <dd className="text-sm text-slate-700 capitalize">{currentUser.role}</dd>
            </div>
            <div className="flex items-center gap-2">
              {isInstructor ? (
                <>
                  <Star className={`h-5 w-5 flex-shrink-0 ${exp.colorClass}`} aria-hidden="true" />
                  <dt className="sr-only">Instructor level</dt>
                  <dd className={`text-sm font-semibold px-2 py-0.5 rounded-full ${exp.colorClass} ${exp.bgClass}`}>{exp.label}</dd>
                </>
              ) : (
                <>
                  <Flame className={`h-5 w-5 flex-shrink-0 ${lvl.colorClass}`} aria-hidden="true" />
                  <dt className="sr-only">Student level</dt>
                  <dd className={`text-sm font-semibold px-2 py-0.5 rounded-full ${lvl.colorClass} ${lvl.bgClass}`}>{lvl.label}</dd>
                </>
              )}
            </div>
          </dl>
        </section>

        {showModal && <EditModal user={currentUser} onClose={() => setShowModal(false)} />}

        {showIDCard && !isInstructor && (
          <IDCardModal
            user={currentUser}
            subtitle="Student Identity Card"
            idPrefix="STU"
            badge={lvl}
            stats={[
              { label: "Enrolled", value: enrolledCount, color: "text-[#1976D2]" },
              { label: "Completed", value: finishedCourses, color: "text-green-600" },
              { label: "Progress", value: `${averageProgress}%`, color: "text-amber-500" },
            ]}
            onClose={() => setShowIDCard(false)}
          />
        )}

        {showInstructorIDCard && isInstructor && (
          <IDCardModal
            user={currentUser}
            subtitle="Instructor Identity Card"
            idPrefix="INS"
            badge={exp}
            stats={[
              { label: "Courses", value: createdCount, color: "text-[#1976D2]" },
              { label: "Students", value: totalStudents, color: "text-green-600" },
              { label: "Rating", value: avgRating, color: "text-yellow-400" },
            ]}
            onClose={() => setShowInstructorIDCard(false)}
          />
        )}

        <section aria-label="Statistics" className="w-full max-w-5xl">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <article className="flex-1 rounded-2xl bg-white p-5 sm:p-6 shadow-md border border-slate-200 flex flex-col items-center justify-center min-h-[130px] sm:min-h-[140px]">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 mb-1 text-center">
                {isInstructor ? "Created Courses" : "Enrolled Courses"}
              </div>
              <p className="mt-1 text-3xl font-bold text-slate-900">{isInstructor ? createdCount : enrolledCount}</p>
              <div className="flex flex-col gap-2 mt-4 w-full">
                {isInstructor ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm sm:text-base font-medium text-slate-700">
                        <Layers className="w-4 h-4 text-purple-500" aria-hidden="true" />Total Modules
                      </span>
                      <span className="text-sm sm:text-base font-bold text-purple-600">{totalModules}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-sm sm:text-base font-medium text-slate-700">
                        <BookOpen className="w-4 h-4 text-[#1976D2]" aria-hidden="true" />Total Lessons
                      </span>
                      <span className="text-sm sm:text-base font-bold text-[#1976D2]">{totalLessons}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-green-500" aria-hidden="true" />Completed
                      </span>
                      <span className="font-semibold text-green-600">{finishedCourses}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#1976D2]" aria-hidden="true" />Hours Learned
                      </span>
                      <span className="font-semibold text-[#1976D2]">{completedHours}h</span>
                    </div>
                  </>
                )}
              </div>
            </article>

            {isInstructor ? (
              <article className="flex-1 rounded-2xl bg-white p-5 sm:p-6 shadow-md border border-slate-200 flex flex-col min-h-[130px] sm:min-h-[140px]">
                <div className="text-sm sm:text-base font-bold uppercase tracking-[0.14em] text-slate-600 mb-2 text-center w-full mt-3">
                  Your Impact
                </div>
                <div className="flex flex-col justify-center flex-1 gap-2 w-full mt-4 sm:mt-7">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm sm:text-base font-medium text-slate-700">
                      <Users className="w-4 h-4 text-green-500" aria-hidden="true" />Total Students
                    </span>
                    <span className="text-sm sm:text-base font-bold text-green-600">{totalStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm sm:text-base font-medium text-slate-700">
                      <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />Avg Rating
                    </span>
                    <span className="text-sm sm:text-base font-bold text-yellow-400">{avgRating}</span>
                  </div>
                </div>
              </article>
            ) : (
              <article className="flex-1 rounded-2xl bg-white p-5 sm:p-6 shadow-md border border-slate-200 flex flex-col min-h-[130px] sm:min-h-[140px]">
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2 text-center w-full">
                  Overall Progress
                </div>
                <div className="flex flex-col items-center justify-center flex-1 gap-3">
                  <p className="text-3xl font-bold text-slate-900" aria-label={`Overall progress: ${progressValue}%`}>
                    {progressValue}%
                  </p>
                  <div
                    role="progressbar"
                    aria-valuenow={progressValue}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Overall learning progress"
                    className="w-full h-4 rounded-full bg-slate-100 overflow-hidden"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${progressValue}%`, backgroundColor: "#1976D2" }}
                    />
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>

        <section aria-label="Quick actions" className="w-full max-w-5xl">
          <h2 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {isInstructor ? (
              <>
                <QuickAction to="/management" icon={<BarChart2 className="w-5 h-5" />} label="Management Panel" sub="Manage your courses" />
                <QuickAction to="/courses" icon={<BookOpen className="w-5 h-5" />} label="Browse Courses" sub="See all published courses" />
                <QuickAction onClick={() => setShowInstructorIDCard(true)} icon={<CreditCard className="w-5 h-5" />} label="Instructor ID Card" sub="View your digital ID" />
              </>
            ) : (
              <>
                <QuickAction to="/enrollments" icon={<Layers className="w-5 h-5" />} label="My Enrollments" sub="Track your learning" />
                <QuickAction to="/courses" icon={<BookOpen className="w-5 h-5" />} label="Browse Courses" sub="Discover new courses" />
                <QuickAction onClick={() => setShowIDCard(true)} icon={<CreditCard className="w-5 h-5" />} label="Student ID Card" sub="View your digital ID" />
              </>
            )}
          </div>
        </section>

        <section aria-label="Badges" className="w-full max-w-5xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-500 uppercase tracking-widest">Badges</h2>
            <span className="text-xs text-slate-400" aria-live="polite">{earnedCount} of {badges.length} earned</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {badges.map((badge, i) => <BadgeCard key={i} {...badge} />)}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;