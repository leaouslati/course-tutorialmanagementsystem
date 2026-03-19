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
  avg >= 80 ? { label: "Expert",       colorClass: "text-rose-500",   bgClass: "bg-rose-50",   hex: "#f43f5e" } :
  avg >= 50 ? { label: "Advanced",     colorClass: "text-purple-600", bgClass: "bg-purple-50", hex: "#9333ea" } :
  avg >= 20 ? { label: "Intermediate", colorClass: "text-amber-500",  bgClass: "bg-amber-50",  hex: "#f59e0b" } :
              { label: "Beginner",     colorClass: "text-green-600",  bgClass: "bg-green-50",  hex: "#22c55e" };

const getInstructorExperience = (created) =>
  created >= 5 ? { label: "Expert Instructor",      colorClass: "text-rose-500",   bgClass: "bg-rose-50",   hex: "#f43f5e" } :
  created >= 3 ? { label: "Established Instructor", colorClass: "text-purple-600", bgClass: "bg-purple-50", hex: "#9333ea" } :
  created >= 1 ? { label: "Rising Instructor",      colorClass: "text-amber-500",  bgClass: "bg-amber-50",  hex: "#f59e0b" } :
                 { label: "New Instructor",          colorClass: "text-green-600",  bgClass: "bg-green-50",  hex: "#22c55e" };

const blueBtn = {
  base: "rounded-xl py-2.5 text-sm font-semibold text-white transition",
  style: { backgroundColor: '#1976D2' },
  onMouseEnter: e => e.currentTarget.style.backgroundColor = '#1565C0',
  onMouseLeave: e => e.currentTarget.style.backgroundColor = '#1976D2',
};

const studentBadges = (finished, enrolled, avg) => [
  { icon: <BookOpen className="w-6 h-6 text-[#1976D2]" />,   bg: "bg-blue-50",   border: "border-blue-200",   title: "First Enrollment",  desc: "Enrolled in your first course",  earned: enrolled >= 1 },
  { icon: <Award className="w-6 h-6 text-amber-500" />,      bg: "bg-amber-50",  border: "border-amber-200",  title: "Course Completer",  desc: "Finished at least one course",   earned: finished >= 1 },
  { icon: <TrendingUp className="w-6 h-6 text-green-500" />, bg: "bg-green-50",  border: "border-green-200",  title: "Overachiever",      desc: "Completed 3+ courses",           earned: finished >= 3 },
  { icon: <Target className="w-6 h-6 text-purple-500" />,    bg: "bg-purple-50", border: "border-purple-200", title: "Halfway There",     desc: "Average progress above 50%",     earned: avg >= 50 },
  { icon: <Zap className="w-6 h-6 text-yellow-500" />,       bg: "bg-yellow-50", border: "border-yellow-200", title: "Fast Learner",      desc: "Enrolled in 5+ courses",         earned: enrolled >= 5 },
  { icon: <Star className="w-6 h-6 text-rose-500" />,        bg: "bg-rose-50",   border: "border-rose-200",   title: "Top Student",       desc: "Average progress above 80%",     earned: avg >= 80 },
];

const instructorBadges = (created, totalLessons) => [
  { icon: <PlusCircle className="w-6 h-6 text-[#1976D2]" />, bg: "bg-blue-50",   border: "border-blue-200",   title: "Course Creator",    desc: "Published your first course", earned: created >= 1 },
  { icon: <Layers className="w-6 h-6 text-purple-500" />,    bg: "bg-purple-50", border: "border-purple-200", title: "Dedicated Teacher", desc: "Created 3+ courses",          earned: created >= 3 },
  { icon: <Shield className="w-6 h-6 text-green-500" />,     bg: "bg-green-50",  border: "border-green-200",  title: "Content Master",    desc: "Published 20+ lessons",       earned: totalLessons >= 20 },
  { icon: <Star className="w-6 h-6 text-amber-500" />,       bg: "bg-amber-50",  border: "border-amber-200",  title: "Expert Instructor", desc: "Created 5+ courses",          earned: created >= 5 },
];

function IDCardModal({ user, subtitle, idPrefix, badge, stats, onClose }) {
  const joined = user.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Unknown";
  const idNumber = `${idPrefix}-${user.id?.toUpperCase().replace("U", "").padStart(4, "0") ?? "0000"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
          <div className="h-20 bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#1976D2] flex items-center px-6 gap-3">
            <BookOpen className="w-6 h-6 text-white/80" />
            <div>
              <p className="text-white font-extrabold text-base tracking-wide leading-tight">CourseHub</p>
              <p className="text-blue-200 text-xs font-medium">{subtitle}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-blue-200 text-[10px] uppercase tracking-widest">ID</p>
              <p className="text-white font-bold text-sm">{idNumber}</p>
            </div>
          </div>
          <div className="px-6 py-5 flex items-start gap-5">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#E3F2FD] flex items-center justify-center border-2 border-[#1976D2]/20">
              <span className="text-2xl font-extrabold text-[#1976D2]">{user.name?.charAt(0)?.toUpperCase() ?? "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{user.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: badge.hex }}>{badge.label}</span>
                <span className="text-xs text-slate-400">· Since {joined}</span>
              </div>
            </div>
          </div>
          <div className="grid border-t border-slate-100" style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
            {stats.map(({ label, value, color }) => (
              <div key={label} className="py-4 text-center">
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <button onClick={onClose} className={`${blueBtn.base} px-6 w-full`} style={blueBtn.style} onMouseEnter={blueBtn.onMouseEnter} onMouseLeave={blueBtn.onMouseLeave}>Close</button>
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
    setTimeout(() => { setInfoSuccess(false); onClose(); }, 1200);
  };

  const handlePasswordSave = () => {
    setPwError("");
    if (!currentPw || !newPw || !confirmPw) { setPwError("All fields are required."); return; }
    if (currentPw !== user.password) { setPwError("Current password is incorrect."); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    user.password = newPw;
    setPwSuccess(true);
    setTimeout(() => { setPwSuccess(false); onClose(); }, 1200);
  };

  const TabBtn = ({ id, label }) => (
    <button onClick={() => setTab(id)} className="flex-1 py-2 rounded-lg text-sm font-semibold transition"
      style={tab === id ? { backgroundColor: '#1976D2', color: '#fff' } : { backgroundColor: '#F4F8FD', color: '#64748b' }}
      onMouseEnter={e => { if (tab !== id) e.currentTarget.style.backgroundColor = '#E3F2FD'; }}
      onMouseLeave={e => { if (tab !== id) e.currentTarget.style.backgroundColor = '#F4F8FD'; }}
    >{label}</button>
  );

  const PwField = ({ label, value, onChange, show, onToggle, placeholder }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1976D2] transition"
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Account Settings</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100 transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="flex gap-2 px-6 py-4 border-b border-slate-100">
          <TabBtn id="info" label="Profile Info" />
          <TabBtn id="password" label="Change Password" />
        </div>
        <div className="px-6 py-6">
          {tab === "info" && (
            <div className="flex flex-col gap-4">
              {[["Full Name", name, setName, "text", "Your full name"], ["Email", email, setEmail, "email", "your@email.com"]].map(([lbl, val, setter, type, ph]) => (
                <div key={lbl} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{lbl}</label>
                  <input value={val} onChange={e => setter(e.target.value)} type={type} placeholder={ph}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#1976D2] transition"
                  />
                </div>
              ))}
              {infoSuccess && <p className="text-xs text-green-600 font-medium">Profile updated successfully!</p>}
              <div className="flex gap-3 mt-2">
                <button onClick={onClose} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleInfoSave} className={`flex-1 ${blueBtn.base}`} style={blueBtn.style} onMouseEnter={blueBtn.onMouseEnter} onMouseLeave={blueBtn.onMouseLeave}>Save Changes</button>
              </div>
            </div>
          )}
          {tab === "password" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-slate-500">Password must be at least 8 characters with a mix of letters and numbers.</p>
              <PwField label="Current Password"    value={currentPw} onChange={e => setCurrentPw(e.target.value)} show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} placeholder="Enter current password" />
              <PwField label="New Password"         value={newPw}     onChange={e => setNewPw(e.target.value)}     show={showNew}     onToggle={() => setShowNew(!showNew)}         placeholder="Enter new password" />
              <PwField label="Confirm New Password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} placeholder="Confirm new password" />
              {pwError   && <p className="text-xs text-red-500 font-medium">{pwError}</p>}
              {pwSuccess && <p className="text-xs text-green-600 font-medium">Password updated successfully!</p>}
              <div className="flex gap-3 mt-2">
                <button onClick={onClose} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handlePasswordSave} className={`flex-1 ${blueBtn.base}`} style={blueBtn.style} onMouseEnter={blueBtn.onMouseEnter} onMouseLeave={blueBtn.onMouseLeave}>Update Password</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ icon, title, desc, earned, bg, border }) {
  return (
    <div className={`rounded-xl border-2 p-4 flex items-start gap-4 transition-all duration-200 ${earned ? `bg-white ${border} shadow-sm` : "bg-slate-50 border-dashed border-slate-200 opacity-50 grayscale"}`}>
      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${earned ? bg : "bg-slate-100"}`}>
        <span className="[&>svg]:w-8 [&>svg]:h-8">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          {earned && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap">Earned</span>}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        {!earned && <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Locked</span>}
      </div>
    </div>
  );
}

function QuickAction({ to, icon, label, sub, onClick }) {
  const inner = (
    <>
      <div className="w-10 h-10 rounded-xl bg-[#E3F2FD] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1976D2] transition-colors duration-200">
        <span className="text-[#1976D2] group-hover:text-white transition-colors duration-200">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#1976D2] transition-colors duration-200" />
    </>
  );
  const cls = "group rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4 hover:border-[#1976D2] hover:shadow-md transition-all duration-200 w-full text-left";
  return to
    ? <Link to={to} className={`${cls} bg-white`} style={{ display: 'flex' }}>{inner}</Link>
    : <button onClick={onClick} className={cls} style={{ backgroundColor: 'white', borderRadius: '0.75rem' }}>{inner}</button>;
}

function Profile() {
  const [currentUser] = useState(mockUser);
  const [showModal, setShowModal] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [showInstructorIDCard, setShowInstructorIDCard] = useState(false);
  const isInstructor = currentUser.role === "instructor";

  const enrolledCourses = Array.isArray(currentUser.enrolledCourses)
    ? courses.filter(c => currentUser.enrolledCourses.includes(c.id)) : [];
  const createdCourses = courses.filter(c => c.instructorId === currentUser.id);

  const countCourseLessons = (course) =>
    Array.isArray(course.modules)
      ? course.modules.reduce((acc, modId) => acc + (modules.find(m => m.id === modId)?.lessons.length || 0), 0) : 0;

  const computeProgress = (course) => currentUser.progress?.[course.id] ?? 0;

  const enrolledCount   = enrolledCourses.length;
  const createdCount    = createdCourses.length;
  const finishedCourses = enrolledCourses.filter(c => computeProgress(c) === 100).length;
  const averageProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((s, c) => s + computeProgress(c), 0) / enrolledCourses.length) : 0;
  const totalModules    = createdCourses.reduce((acc, c) => acc + (Array.isArray(c.modules) ? c.modules.length : 0), 0);
  const totalLessons    = createdCourses.reduce((acc, c) => acc + countCourseLessons(c), 0);
  const totalStudents   = createdCourses.reduce((acc, c) => acc + (c.studentsCount || 0), 0);
  const avgRating       = createdCourses.length > 0
    ? (createdCourses.reduce((acc, c) => acc + (c.rating || 0), 0) / createdCourses.length).toFixed(1) : "—";
  const progressValue   = isInstructor ? Math.min(createdCount * 18, 100) : averageProgress;
  const completedHours  = enrolledCourses.reduce((s, c) => s + (computeProgress(c) * c.duration) / 100, 0).toFixed(1);

  const badges      = isInstructor ? instructorBadges(createdCount, totalLessons) : studentBadges(finishedCourses, enrolledCount, averageProgress);
  const earnedCount = badges.filter(b => b.earned).length;
  const lvl         = getLevelByProgress(averageProgress);
  const exp         = getInstructorExperience(createdCount);

  return (
    <div className="w-screen min-h-screen bg-[#F4F8FD] text-slate-800">
      <Navbar isLoggedIn={Boolean(currentUser)} />
      <main className="w-full min-h-screen px-4 py-6 flex flex-col items-center gap-8">

        <section className="w-full max-w-5xl rounded-2xl bg-white shadow-md border border-slate-200 overflow-hidden">
          <div className="px-8 pt-8 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0 h-20 w-20 rounded-2xl bg-[#E3F2FD] flex items-center justify-center">
                <span className="text-3xl font-extrabold text-[#1976D2]">{currentUser.name?.charAt(0)?.toUpperCase() ?? "U"}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
                <span className="inline-flex rounded-full bg-[#FCD34D] px-3 py-0.5 text-xs font-bold capitalize text-slate-800 mt-1">{currentUser.role}</span>
              </div>
            </div>
            <button onClick={() => setShowModal(true)}
              className="self-start sm:self-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow transition"
              style={{ backgroundColor: '#1976D2' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1565C0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1976D2'}
            >
              <Edit2 className="h-4 w-4" /> Edit Profile
            </button>
          </div>
          <div className="px-8 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t-2 border-slate-200 pt-5">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#1976D2]" />
              <span className="text-sm text-slate-700">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#1976D2]" />
              <span className="text-sm text-slate-700">Joined: {currentUser.joinedDate ? new Date(currentUser.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#1976D2]" />
              <span className="text-sm text-slate-700 capitalize">{currentUser.role}</span>
            </div>
            <div className="flex items-center gap-2">
              {isInstructor ? (
                <>
                  <Star className={`h-5 w-5 ${exp.colorClass}`} />
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${exp.colorClass} ${exp.bgClass}`}>{exp.label}</span>
                </>
              ) : (
                <>
                  <Flame className={`h-5 w-5 ${lvl.colorClass}`} />
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${lvl.colorClass} ${lvl.bgClass}`}>{lvl.label}</span>
                </>
              )}
            </div>
          </div>
        </section>

        {showModal && <EditModal user={currentUser} onClose={() => setShowModal(false)} />}
        {showIDCard && !isInstructor && (
          <IDCardModal user={currentUser} subtitle="Student Identity Card" idPrefix="STU"
            badge={lvl}
            stats={[
              { label: "Enrolled",  value: enrolledCount,         color: "text-[#1976D2]" },
              { label: "Completed", value: finishedCourses,       color: "text-green-600" },
              { label: "Progress",  value: `${averageProgress}%`, color: "text-amber-500" },
            ]}
            onClose={() => setShowIDCard(false)}
          />
        )}
        {showInstructorIDCard && isInstructor && (
          <IDCardModal user={currentUser} subtitle="Instructor Identity Card" idPrefix="INS"
            badge={exp}
            stats={[
              { label: "Courses",  value: createdCount,  color: "text-[#1976D2]" },
              { label: "Students", value: totalStudents, color: "text-green-600" },
              { label: "Rating",   value: avgRating,     color: "text-yellow-400" },
            ]}
            onClose={() => setShowInstructorIDCard(false)}
          />
        )}

        <section className="w-full max-w-5xl">
          <div className="flex flex-row gap-6">
            <article className="flex-1 rounded-2xl bg-white p-6 shadow-md border border-slate-200 flex flex-col items-center justify-center min-h-[140px]">
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 mb-1">
                {isInstructor ? "Created Courses" : "Enrolled Courses"}
              </div>
              <p className="mt-1 text-3xl font-bold text-slate-900">{isInstructor ? createdCount : enrolledCount}</p>
              <div className="flex flex-col gap-2 mt-4 w-full">
                {isInstructor ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-base font-medium text-slate-700"><Layers className="w-4 h-4 text-purple-500" />Total Modules</span>
                      <span className="text-base font-bold text-purple-600">{totalModules}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-base font-medium text-slate-700"><BookOpen className="w-4 h-4 text-[#1976D2]" />Total Lessons</span>
                      <span className="text-base font-bold text-[#1976D2]">{totalLessons}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-green-500" />Completed</span>
                      <span className="font-semibold text-green-600">{finishedCourses}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#1976D2]" />Hours Learned</span>
                      <span className="font-semibold text-[#1976D2]">{completedHours}h</span>
                    </div>
                  </>
                )}
              </div>
            </article>

            {isInstructor ? (
              <article className="flex-1 rounded-2xl bg-white p-6 shadow-md border border-slate-200 flex flex-col min-h-[140px]">
                <div className="text-base font-bold uppercase tracking-[0.14em] text-slate-600 mb-2 text-center w-full mt-3">Your Impact</div>
                <div className="flex flex-col justify-center flex-1 gap-1.5 w-full mt-7">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-base font-medium text-slate-700"><Users className="w-4 h-4 text-green-500" />Total Students</span>
                    <span className="text-base font-bold text-green-600">{totalStudents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-base font-medium text-slate-700"><Star className="w-4 h-4 text-yellow-400" />Avg Rating</span>
                    <span className="text-base font-bold text-yellow-400">{avgRating}</span>
                  </div>
                </div>
              </article>
            ) : (
              <article className="flex-1 rounded-2xl bg-white p-6 shadow-md border border-slate-200 flex flex-col min-h-[140px]">
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2 text-center w-full">Overall Progress</div>
                <div className="flex flex-col items-center justify-center flex-1 gap-3">
                  <p className="text-3xl font-bold text-slate-900">{progressValue}%</p>
                  <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressValue}%`, backgroundColor: '#1976D2' }} />
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>

        <section className="w-full max-w-5xl">
          <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {isInstructor ? (
              <>
                <QuickAction to="/management" icon={<BarChart2 className="w-5 h-5" />}  label="Management Panel"  sub="Manage your courses" />
                <QuickAction to="/courses"    icon={<BookOpen className="w-5 h-5" />}   label="Browse Courses"    sub="See all published courses" />
                <QuickAction onClick={() => setShowInstructorIDCard(true)} icon={<CreditCard className="w-5 h-5" />} label="Instructor ID Card" sub="View your digital ID" />
              </>
            ) : (
              <>
                <QuickAction to="/enrollments" icon={<Layers className="w-5 h-5" />}    label="My Enrollments"   sub="Track your learning" />
                <QuickAction to="/courses"     icon={<BookOpen className="w-5 h-5" />}  label="Browse Courses"   sub="Discover new courses" />
                <QuickAction onClick={() => setShowIDCard(true)} icon={<CreditCard className="w-5 h-5" />} label="Student ID Card" sub="View your digital ID" />
              </>
            )}
          </div>
        </section>

        <section className="w-full max-w-5xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-500 uppercase tracking-widest">Badges</h3>
            <span className="text-xs text-slate-400">{earnedCount} of {badges.length} earned</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, i) => <BadgeCard key={i} {...badge} />)}
          </div>
        </section>

      </main>
    </div>
  );
}

export default Profile;