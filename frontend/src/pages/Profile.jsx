import { Link } from "react-router-dom";
import { courses, modules } from "../data/mockdata";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../pages/AuthContext";
import { authFetch } from "../api";
import {
  Mail, Calendar, User, Users, Edit2, Eye, EyeOff, Lock, X, Flame, CreditCard,
  BookOpen, TrendingUp, Layers, BarChart2, ArrowRight,
  Star, Zap, Target, Shield, Award, Clock, PlusCircle
} from "lucide-react";

const LEVELS = [
  { min: 80, label: "Expert", colorClass: "text-rose-500", bgClass: "bg-rose-50", hex: "#f43f5e" },
  { min: 50, label: "Advanced", colorClass: "text-purple-600", bgClass: "bg-purple-50", hex: "#9333ea" },
  { min: 20, label: "Intermediate", colorClass: "text-amber-500", bgClass: "bg-amber-50", hex: "#f59e0b" },
  { min: 0, label: "Beginner", colorClass: "text-green-600", bgClass: "bg-green-50", hex: "#22c55e" },
];

const INSTRUCTOR_LEVELS = [
  { min: 5, label: "Expert Instructor", colorClass: "text-rose-500", bgClass: "bg-rose-50", hex: "#f43f5e" },
  { min: 3, label: "Established Instructor", colorClass: "text-purple-600", bgClass: "bg-purple-50", hex: "#9333ea" },
  { min: 1, label: "Rising Instructor", colorClass: "text-amber-500", bgClass: "bg-amber-50", hex: "#f59e0b" },
  { min: 0, label: "New Instructor", colorClass: "text-green-600", bgClass: "bg-green-50", hex: "#22c55e" },
];

const getLevel = (arr, val) => arr.find((l) => val >= l.min);

const mkStudentBadges = (fin, enr, avg) => [
  { icon: <BookOpen className="w-6 h-6 text-[#1976D2]" />, bg: "bg-blue-50", border: "border-blue-200", title: "First Enrollment", desc: "Enrolled in your first course", earned: enr >= 1 },
  { icon: <Award className="w-6 h-6 text-amber-500" />, bg: "bg-amber-50", border: "border-amber-200", title: "Course Completer", desc: "Finished at least one course", earned: fin >= 1 },
  { icon: <TrendingUp className="w-6 h-6 text-green-500" />, bg: "bg-green-50", border: "border-green-200", title: "Overachiever", desc: "Completed 3+ courses", earned: fin >= 3 },
  { icon: <Target className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50", border: "border-purple-200", title: "Halfway There", desc: "Average progress above 50%", earned: avg >= 50 },
  { icon: <Zap className="w-6 h-6 text-yellow-500" />, bg: "bg-yellow-50", border: "border-yellow-200", title: "Fast Learner", desc: "Enrolled in 5+ courses", earned: enr >= 5 },
  { icon: <Star className="w-6 h-6 text-rose-500" />, bg: "bg-rose-50", border: "border-rose-200", title: "Top Student", desc: "Average progress above 80%", earned: avg >= 80 },
];

const mkInstructorBadges = (cre, les) => [
  { icon: <PlusCircle className="w-6 h-6 text-[#1976D2]" />, bg: "bg-blue-50", border: "border-blue-200", title: "Course Creator", desc: "Published your first course", earned: cre >= 1 },
  { icon: <Layers className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50", border: "border-purple-200", title: "Dedicated Teacher", desc: "Created 3+ courses", earned: cre >= 3 },
  { icon: <Shield className="w-6 h-6 text-green-500" />, bg: "bg-green-50", border: "border-green-200", title: "Content Master", desc: "Published 20+ lessons", earned: les >= 20 },
  { icon: <Star className="w-6 h-6 text-amber-500" />, bg: "bg-amber-50", border: "border-amber-200", title: "Expert Instructor", desc: "Created 5+ courses", earned: cre >= 5 },
];

function useFocusTrap(active) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const els = ref.current.querySelectorAll(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );

    const first = els[0];
    const last = els[els.length - 1];
    first?.focus();

    const handler = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [active]);

  return ref;
}

function useEscapeKey(fn) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") fn();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [fn]);
}

function StatRow({ icon, label, value, valueClass, small = false, darkMode }) {
  const size = small ? "text-sm" : "text-base";

  return (
    <div className="flex items-center justify-between">
      <span
        className={`flex items-center gap-1.5 ${size} font-medium`}
        style={{ color: darkMode ? "#94a3b8" : "#334155" }}
      >
        <span aria-hidden="true">{icon}</span>
        {label}
      </span>
      <span className={`${size} font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}

function PwField({
  label,
  fieldId,
  value,
  onChange,
  showKey,
  placeholder,
  show,
  setShow,
  inputStyle,
  iconCol,
  labelCol,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={fieldId}
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: labelCol }}
      >
        {label}
      </label>

      <div className="relative">
        <Lock
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: iconCol }}
          aria-hidden="true"
        />

        <input
          id={fieldId}
          type={show[showKey] ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ ...inputStyle, paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
        />

        <button
          type="button"
          onClick={() => setShow((s) => ({ ...s, [showKey]: !s[showKey] }))}
          aria-label={show[showKey] ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ background: "none", border: "none", padding: 0, color: iconCol }}
        >
          {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function IDCardModal({ user, subtitle, idPrefix, badge, stats, onClose, darkMode }) {
  const trapRef = useFocusTrap(true);
  useEscapeKey(onClose);

  const joined = user.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : user.joined_date
    ? new Date(user.joined_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Unknown";

  const idNumber = `${idPrefix}-${String(user.id ?? "0000").padStart(4, "0")}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="idcard-title"
    >
      <div ref={trapRef} className="w-full max-w-sm flex flex-col items-center gap-4">
        <div
          className="w-full rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: darkMode ? "#0f1f3d" : "#ffffff",
            border: `1px solid ${darkMode ? "#1a3a6b" : "#e2e8f0"}`,
          }}
        >
          <div className="h-20 bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#1976D2] flex items-center px-6 gap-3">
            <BookOpen className="w-6 h-6 text-white/80" aria-hidden="true" />
            <div>
              <p id="idcard-title" className="text-white font-extrabold text-base tracking-wide leading-tight">
                CourseHub
              </p>
              <p className="text-blue-200 text-xs font-medium">{subtitle}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-blue-200 text-[10px] uppercase tracking-widest">ID</p>
              <p className="text-white font-bold text-sm">{idNumber}</p>
            </div>
          </div>

          <div className="px-6 py-5 flex items-start gap-5">
            <div
              aria-hidden="true"
              className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: darkMode ? "#0a1628" : "#E3F2FD",
                border: `2px solid ${darkMode ? "#1a3a6b" : "rgba(25,118,210,0.2)"}`,
              }}
            >
              <span className="text-2xl font-extrabold text-[#1976D2]">
                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-extrabold leading-tight" style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}>
                {user.name}
              </h3>
              <p className="text-xs mt-0.5 truncate" style={{ color: "#64748b" }}>
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: badge.hex }}
                >
                  {badge.label}
                </span>
                <span className="text-xs" style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>
                  · Since {joined}
                </span>
              </div>
            </div>
          </div>

          <div
            className="grid border-t"
            style={{
              gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
              borderColor: darkMode ? "#1a3a6b" : "#f1f5f9",
            }}
          >
            {stats.map(({ label, value, color }) => (
              <div key={label} className="py-4 text-center">
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                <p
                  className="text-[10px] uppercase tracking-wider mt-0.5"
                  style={{ color: darkMode ? "#64748b" : "#94a3b8" }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl py-2.5 px-6 text-sm font-semibold text-white transition"
          style={{ backgroundColor: "#1976D2" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
        >
          Close
        </button>
      </div>
    </div>
  );
}

function EditModal({ user, setUser, onClose, darkMode }) {
  const [tab, setTab] = useState("info");
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [infoError, setInfoError] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const trapRef = useFocusTrap(true);

  useEscapeKey(onClose);

  const modalBg = darkMode ? "#0f1f3d" : "#ffffff";
  const modalBorder = darkMode ? "#1a3a6b" : "#f1f5f9";
  const headingCol = darkMode ? "#f1f5f9" : "#0f172a";
  const labelCol = darkMode ? "#94a3b8" : "#64748b";
  const inputBg = darkMode ? "#0a1628" : "#ffffff";
  const inputText = darkMode ? "#f1f5f9" : "#1e293b";
  const inputBorder = darkMode ? "#1a3a6b" : "#e2e8f0";
  const iconCol = darkMode ? "#64748b" : "#94a3b8";
  const mutedCol = darkMode ? "#64748b" : "#64748b";

  const inputStyle = {
    backgroundColor: inputBg,
    color: inputText,
    border: `1px solid ${inputBorder}`,
    borderRadius: "0.75rem",
    padding: "0.625rem 1rem",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
  };

  const handleInfoSave = async () => {
    try {
      setInfoError("");
      setInfoSuccess(false);

      const res = await authFetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser((prev) => ({
        ...prev,
        ...data,
      }));

      setInfoSuccess(true);

      setTimeout(() => {
        setInfoSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      setInfoError(error.message || "Failed to update profile");
    }
  };

  const handlePasswordSave = async () => {
    setPwError("");
    setPwSuccess(false);

    if (!currentPw || !newPw || !confirmPw) {
      setPwError("All fields are required.");
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

    try {
      const res = await authFetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: currentPw,
          newPassword: newPw,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setPwError(data.message || "Current password is incorrect.");
          return;
        }
        throw new Error(data.message || "Failed to update password");
      }

      setUser((prev) => ({
        ...prev,
        ...data,
      }));

      setPwSuccess(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");

      setTimeout(() => {
        setPwSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      setPwError(error.message || "Failed to update password");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div
        ref={trapRef}
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: modalBg, border: `1px solid ${modalBorder}` }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: modalBorder }}>
          <h3 id="edit-modal-title" className="text-lg font-bold" style={{ color: headingCol }}>
            Account Settings
          </h3>
          <button
            onClick={onClose}
            aria-label="Close account settings"
            className="rounded-lg p-1.5 transition"
            style={{ color: iconCol }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f1f5f9")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex gap-2 px-6 py-4 border-b" style={{ borderColor: modalBorder }}>
          {["info", "password"].map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 py-2 rounded-lg text-sm font-semibold transition"
              style={
                tab === id
                  ? { backgroundColor: "#1976D2", color: "#ffffff" }
                  : {
                      backgroundColor: darkMode ? "#0a1628" : "#F4F8FD",
                      color: darkMode ? "#94a3b8" : "#64748b",
                    }
              }
              onMouseEnter={(e) => {
                if (tab !== id) e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#E3F2FD";
              }}
              onMouseLeave={(e) => {
                if (tab !== id) e.currentTarget.style.backgroundColor = darkMode ? "#0a1628" : "#F4F8FD";
              }}
            >
              {id === "info" ? "Profile Info" : "Change Password"}
            </button>
          ))}
        </div>

        <div className="px-6 py-6">
          {tab === "info" && (
            <div className="flex flex-col gap-4">
              {[
                { lbl: "Full Name", id: "edit-name", val: name, set: setName, type: "text", ph: "Your full name" },
                { lbl: "Email", id: "edit-email", val: email, set: setEmail, type: "email", ph: "your@email.com" },
              ].map(({ lbl, id, val, set, type, ph }) => (
                <div key={id} className="flex flex-col gap-1">
                  <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider" style={{ color: labelCol }}>
                    {lbl}
                  </label>
                  <input
                    id={id}
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    type={type}
                    placeholder={ph}
                    style={inputStyle}
                  />
                </div>
              ))}

              {infoError && (
                <p role="alert" className="text-xs text-red-500 font-medium">
                  {infoError}
                </p>
              )}

              {infoSuccess && (
                <p role="status" className="text-xs text-green-500 font-medium">
                  Profile updated successfully!
                </p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid ${darkMode ? "#1a3a6b" : "#cbd5e1"}`,
                    color: darkMode ? "#94a3b8" : "#475569",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Cancel
                </button>
                <button
                  onClick={handleInfoSave}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition"
                  style={{ backgroundColor: "#1976D2" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {tab === "password" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs" style={{ color: mutedCol }}>
                Password must be at least 8 characters with a mix of letters and numbers.
              </p>

              <PwField
                label="Current Password"
                fieldId="pw-current"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                showKey="current"
                placeholder="Enter current password"
                show={show}
                setShow={setShow}
                inputStyle={inputStyle}
                iconCol={iconCol}
                labelCol={labelCol}
              />

              <PwField
                label="New Password"
                fieldId="pw-new"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                showKey="new"
                placeholder="Enter new password"
                show={show}
                setShow={setShow}
                inputStyle={inputStyle}
                iconCol={iconCol}
                labelCol={labelCol}
              />

              <PwField
                label="Confirm New Password"
                fieldId="pw-confirm"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                showKey="confirm"
                placeholder="Confirm new password"
                show={show}
                setShow={setShow}
                inputStyle={inputStyle}
                iconCol={iconCol}
                labelCol={labelCol}
              />

              {pwError && (
                <p role="alert" className="text-xs text-red-500 font-medium">
                  {pwError}
                </p>
              )}

              {pwSuccess && (
                <p role="status" className="text-xs text-green-500 font-medium">
                  Password updated successfully!
                </p>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid ${darkMode ? "#1a3a6b" : "#cbd5e1"}`,
                    color: darkMode ? "#94a3b8" : "#475569",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSave}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition"
                  style={{ backgroundColor: "#1976D2" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ icon, title, desc, earned, bg, border, darkMode }) {
  return (
    <div
      className="rounded-xl border-2 p-4 flex items-start gap-4 transition-all duration-200"
      style={{
        backgroundColor: earned ? (darkMode ? "#0f1f3d" : "#ffffff") : darkMode ? "#0a1628" : "#f8fafc",
        borderColor: earned ? (darkMode ? "#1e3f7a" : undefined) : darkMode ? "#1a3a6b" : "#e2e8f0",
        borderStyle: earned ? "solid" : "dashed",
        opacity: earned ? 1 : darkMode ? 0.4 : 0.5,
        filter: earned ? "none" : "grayscale(1)",
      }}
    >
      <div
        aria-hidden="true"
        className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${earned ? bg : "bg-slate-100"}`}
      >
        <span className="[&>svg]:w-8 [&>svg]:h-8">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold" style={{ color: darkMode ? "#f1f5f9" : "#1e293b" }}>
            {title}
          </p>
          {earned ? (
            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full whitespace-nowrap border border-green-500/20">
              Earned
            </span>
          ) : (
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: darkMode ? "#475569" : "#94a3b8" }}>
              Locked
            </span>
          )}
        </div>
        <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

function QuickAction({ to, icon, label, sub, onClick, darkMode }) {
  const style = {
    backgroundColor: darkMode ? "#0f1f3d" : "#ffffff",
    border: "1px solid transparent",
    borderRadius: "0.75rem",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    width: "100%",
    textAlign: "left",
    transition: "all 0.2s",
    cursor: "pointer",
  };

  const inner = () => (
    <>
      <div
        aria-hidden="true"
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
        style={{ backgroundColor: darkMode ? "rgba(25,118,210,0.15)" : "#E3F2FD" }}
      >
        <span style={{ color: "#1976D2" }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: darkMode ? "#f1f5f9" : "#1e293b" }}>
          {label}
        </p>
        <p className="text-xs" style={{ color: "#64748b" }}>
          {sub}
        </p>
      </div>
      <ArrowRight
        aria-hidden="true"
        className="w-4 h-4 flex-shrink-0"
        style={{ color: darkMode ? "#1a3a6b" : "#cbd5e1" }}
      />
    </>
  );

  const hoverStyle = {
    ...style,
    border: "1px solid #1976D2",
    boxShadow: darkMode ? "0 0 16px 2px rgba(25,118,210,0.2)" : "0 4px 12px rgba(0,0,0,0.08)",
  };

  const [hovered, setHovered] = useState(false);

  return to ? (
    <Link
      to={to}
      style={hovered ? hoverStyle : style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner()}
    </Link>
  ) : (
    <button
      onClick={onClick}
      style={hovered ? hoverStyle : style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner()}
    </button>
  );
}

export default function Profile({ darkMode = false }) {
  const { currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [showInstructorIDCard, setShowInstructorIDCard] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const res = await authFetch("/api/users/me");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser((prev) => ({
          ...prev,
          ...currentUser,
          ...data,
        }));
      } catch (error) {
        setLoadError(error.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (loadError) {
    return <div className="p-6 text-red-500">{loadError}</div>;
  }

  if (!user) {
    return null;
  }

  const isInstructor = user.role === "instructor";

  const enrolledCourses = Array.isArray(user.enrolledCourses)
    ? courses.filter((c) => user.enrolledCourses.includes(c.id))
    : [];

  const createdCourses = courses.filter((c) => c.instructorId === user.id);

  const lessonCount = (course) =>
    Array.isArray(course.modules)
      ? course.modules.reduce(
          (a, id) => a + (modules.find((m) => m.id === id)?.lessons.length || 0),
          0
        )
      : 0;

  const progress = (course) => user.progress?.[course.id] ?? 0;

  const enrolledCount = enrolledCourses.length;
  const createdCount = createdCourses.length;
  const finished = enrolledCourses.filter((c) => progress(c) === 100).length;
  const avgProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((s, c) => s + progress(c), 0) / enrolledCourses.length)
    : 0;

  const totalModules = createdCourses.reduce(
    (a, c) => a + (Array.isArray(c.modules) ? c.modules.length : 0),
    0
  );

  const totalLessons = createdCourses.reduce((a, c) => a + lessonCount(c), 0);
  const totalStudents = createdCourses.reduce((a, c) => a + (c.studentsCount || 0), 0);
  const avgRating = createdCourses.length
    ? (createdCourses.reduce((a, c) => a + (c.rating || 0), 0) / createdCourses.length).toFixed(1)
    : "—";

  const progressVal = isInstructor ? Math.min(createdCount * 18, 100) : avgProgress;

  const completedHours = enrolledCourses
    .reduce((s, c) => s + (progress(c) * c.duration) / 100, 0)
    .toFixed(1);

  const lvl = getLevel(LEVELS, avgProgress);
  const exp = getLevel(INSTRUCTOR_LEVELS, createdCount);
  const levelTag = isInstructor ? exp : lvl;

  const badges = isInstructor
    ? mkInstructorBadges(createdCount, totalLessons)
    : mkStudentBadges(finished, enrolledCount, avgProgress);

  const earned = badges.filter((b) => b.earned).length;

  const pageBg = darkMode ? "#060f1e" : "#F4F8FD";
  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder = darkMode ? "#1a3a6b" : "#e2e8f0";
  const headingCol = darkMode ? "#f1f5f9" : "#0f172a";
  const subCol = darkMode ? "#94a3b8" : "#475569";
  const mutedCol = darkMode ? "#64748b" : "#94a3b8";
  const dividerCol = darkMode ? "#1a3a6b" : "#e2e8f0";
  const progressBg = darkMode ? "#1a3a6b" : "#f1f5f9";
  const sectionLbl = darkMode ? "#64748b" : "#64748b";

  const joinedValue = user.joinedDate
    ? new Date(user.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : user.joined_date
    ? new Date(user.joined_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Unknown";

  const infoRows = [
    { icon: <Mail className="h-5 w-5 text-[#1976D2]" />, text: user.email },
    { icon: <Calendar className="h-5 w-5 text-[#1976D2]" />, text: `Joined: ${joinedValue}` },
    { icon: <User className="h-5 w-5 text-[#1976D2]" />, text: user.role },
  ];

  return (
    <div className="w-full min-h-screen transition-colors duration-300" style={{ backgroundColor: pageBg }}>
      <main className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center gap-8">
        <section
          aria-labelledby="profile-heading"
          className="w-full max-w-5xl rounded-2xl shadow-md overflow-hidden"
          style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <div className="px-6 sm:px-8 pt-8 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-5">
              <div
                aria-hidden="true"
                className="flex-shrink-0 h-20 w-20 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: darkMode ? "#0a1628" : "#E3F2FD" }}
              >
                <span className="text-3xl font-extrabold text-[#1976D2]">
                  {user.name?.charAt(0)?.toUpperCase() ?? "U"}
                </span>
              </div>
              <div>
                <h2 id="profile-heading" className="text-2xl font-bold" style={{ color: headingCol }}>
                  {user.name}
                </h2>
                <span className="inline-flex rounded-full bg-[#FCD34D] px-3 py-0.5 text-xs font-bold capitalize text-slate-800 mt-1">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="self-start sm:self-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition shadow"
              style={{ backgroundColor: "#1976D2" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
            >
              <Edit2 className="h-4 w-4" aria-hidden="true" /> Edit Profile
            </button>
          </div>

          <div
            className="px-6 sm:px-8 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t-2 pt-5"
            style={{ borderColor: dividerCol }}
          >
            {infoRows.map(({ icon, text, cls = "" }, i) => (
              <div key={i} className="flex items-center gap-2">
                <span aria-hidden="true">{icon}</span>
                <span className={`text-sm ${cls}`} style={{ color: subCol }}>
                  {text}
                </span>
              </div>
            ))}

            <div className="flex items-center gap-2">
              <span aria-hidden="true">
                {isInstructor ? (
                  <Star className={`h-5 w-5 ${exp.colorClass}`} />
                ) : (
                  <Flame className={`h-5 w-5 ${lvl.colorClass}`} />
                )}
              </span>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${levelTag.colorClass} ${levelTag.bgClass}`}>
                {levelTag.label}
              </span>
            </div>
          </div>
        </section>

        {showModal && (
          <EditModal
            user={user}
            setUser={setUser}
            onClose={() => setShowModal(false)}
            darkMode={darkMode}
          />
        )}

        {showIDCard && !isInstructor && (
          <IDCardModal
            user={user}
            subtitle="Student Identity Card"
            idPrefix="STU"
            badge={lvl}
            stats={[
              { label: "Enrolled", value: enrolledCount, color: "text-[#1976D2]" },
              { label: "Completed", value: finished, color: "text-green-500" },
              { label: "Progress", value: `${avgProgress}%`, color: "text-amber-500" },
            ]}
            onClose={() => setShowIDCard(false)}
            darkMode={darkMode}
          />
        )}

        {showInstructorIDCard && isInstructor && (
          <IDCardModal
            user={user}
            subtitle="Instructor Identity Card"
            idPrefix="INS"
            badge={exp}
            stats={[
              { label: "Courses", value: createdCount, color: "text-[#1976D2]" },
              { label: "Students", value: totalStudents, color: "text-green-500" },
              { label: "Rating", value: avgRating, color: "text-yellow-400" },
            ]}
            onClose={() => setShowInstructorIDCard(false)}
            darkMode={darkMode}
          />
        )}

        <section aria-labelledby="stats-heading" className="w-full max-w-5xl">
          <h3 id="stats-heading" className="sr-only">Your stats</h3>
          <div className="flex flex-col sm:flex-row gap-6">
            <article
              className="flex-1 rounded-2xl p-6 shadow-md flex flex-col min-h-[140px]"
              style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <div className="text-sm font-semibold uppercase tracking-[0.14em] mb-1" style={{ color: mutedCol }}>
                {isInstructor ? "Created Courses" : "Enrolled Courses"}
              </div>

              <p className="mt-1 text-3xl font-bold" style={{ color: headingCol }}>
                {isInstructor ? createdCount : enrolledCount}
              </p>

              <div className="flex flex-col gap-2 mt-4 w-full">
                {isInstructor ? (
                  <>
                    <StatRow
                      darkMode={darkMode}
                      icon={<Layers className="w-4 h-4 text-purple-500" />}
                      label="Total Modules"
                      value={totalModules}
                      valueClass="text-purple-500"
                    />
                    <StatRow
                      darkMode={darkMode}
                      icon={<BookOpen className="w-4 h-4 text-[#1976D2]" />}
                      label="Total Lessons"
                      value={totalLessons}
                      valueClass="text-[#1976D2]"
                    />
                  </>
                ) : (
                  <>
                    <StatRow
                      darkMode={darkMode}
                      icon={<Award className="w-4 h-4 text-green-500" />}
                      label="Completed"
                      value={finished}
                      valueClass="text-green-500"
                      small
                    />
                    <StatRow
                      darkMode={darkMode}
                      icon={<Clock className="w-4 h-4 text-[#1976D2]" />}
                      label="Hours Learned"
                      value={`${completedHours}h`}
                      valueClass="text-[#1976D2]"
                      small
                    />
                  </>
                )}
              </div>
            </article>

            {isInstructor ? (
              <article
                className="flex-1 rounded-2xl p-6 shadow-md flex flex-col min-h-[140px]"
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="text-base font-bold uppercase tracking-[0.14em] mb-2 text-center mt-3" style={{ color: subCol }}>
                  Your Impact
                </div>
                <div className="flex flex-col justify-center flex-1 gap-1.5 mt-7">
                  <StatRow
                    darkMode={darkMode}
                    icon={<Users className="w-4 h-4 text-green-500" />}
                    label="Total Students"
                    value={totalStudents}
                    valueClass="text-green-500"
                  />
                  <StatRow
                    darkMode={darkMode}
                    icon={<Star className="w-4 h-4 text-yellow-400" />}
                    label="Avg Rating"
                    value={avgRating}
                    valueClass="text-yellow-400"
                  />
                </div>
              </article>
            ) : (
              <article
                className="flex-1 rounded-2xl p-6 shadow-md flex flex-col min-h-[140px]"
                style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
              >
                <div className="text-sm font-semibold uppercase tracking-[0.14em] mb-2 text-center" style={{ color: mutedCol }}>
                  Overall Progress
                </div>
                <div className="flex flex-col items-center justify-center flex-1 gap-3">
                  <p className="text-3xl font-bold" style={{ color: headingCol }}>
                    {progressVal}%
                  </p>
                  <div
                    role="progressbar"
                    aria-valuenow={progressVal}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Overall course progress"
                    className="w-full h-4 rounded-full overflow-hidden"
                    style={{ backgroundColor: progressBg }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700 bg-[#1976D2]"
                      style={{ width: `${progressVal}%` }}
                    />
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>

        <section aria-labelledby="actions-heading" className="w-full max-w-5xl">
          <h3 id="actions-heading" className="text-base font-bold uppercase tracking-widest mb-4" style={{ color: sectionLbl }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {isInstructor ? (
              <>
                <QuickAction darkMode={darkMode} to="/management" icon={<BarChart2 className="w-5 h-5" />} label="Management Panel" sub="Manage your courses" />
                <QuickAction darkMode={darkMode} to="/courses" icon={<BookOpen className="w-5 h-5" />} label="Browse Courses" sub="See all published courses" />
                <QuickAction darkMode={darkMode} onClick={() => setShowInstructorIDCard(true)} icon={<CreditCard className="w-5 h-5" />} label="Instructor ID Card" sub="View your digital ID" />
              </>
            ) : (
              <>
                <QuickAction darkMode={darkMode} to="/enrollments" icon={<Layers className="w-5 h-5" />} label="My Enrollments" sub="Track your learning" />
                <QuickAction darkMode={darkMode} to="/courses" icon={<BookOpen className="w-5 h-5" />} label="Browse Courses" sub="Discover new courses" />
                <QuickAction darkMode={darkMode} onClick={() => setShowIDCard(true)} icon={<CreditCard className="w-5 h-5" />} label="Student ID Card" sub="View your digital ID" />
              </>
            )}
          </div>
        </section>

        <section aria-labelledby="badges-heading" className="w-full max-w-5xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 id="badges-heading" className="text-base font-bold uppercase tracking-widest" style={{ color: sectionLbl }}>
              Badges
            </h3>
            <span className="text-xs" style={{ color: mutedCol }}>
              {earned} of {badges.length} earned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge, i) => (
              <BadgeCard key={i} {...badge} darkMode={darkMode} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}