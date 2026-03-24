import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, BookOpen, GraduationCap, CheckCircle } from "lucide-react";
import { useAuth } from "./AuthContext";
import { users } from "../data/mockdata";

export default function Register({ darkMode = false }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [errors,  setErrors]  = useState({});
  const [success, setSuccess] = useState(false);

  // ── color tokens ──────────────────────────────────────────────────────
  const cardBg      = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder  = darkMode ? "#1a3a6b" : "rgba(255,255,255,0.2)";
  const headingCol  = "#ffffff";
  const subCol      = darkMode ? "#94a3b8" : "#bfdbfe";
  const labelCol    = darkMode ? "#94a3b8" : "#475569";
  const inputBg     = darkMode ? "#0a1628" : "#ffffff";
  const inputText   = darkMode ? "#f1f5f9" : "#1e293b";
  const inputBorder = darkMode ? "#1a3a6b" : "#cbd5e1";
  const iconCol     = darkMode ? "#64748b" : "#94a3b8";
  const footerCol   = darkMode ? "#64748b" : "#bfdbfe";
  const linkSubCol  = darkMode ? "#64748b" : "#64748b";

  const heroBg = darkMode
    ? "linear-gradient(135deg, #020b18 0%, #041530 25%, #0a2550 50%, #0d3272 65%, #1048a0 85%, #1565C0 100%)"
    : "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)";

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name     = "Full name is required.";
    else if (form.name.trim().length < 2) e.name    = "Name must be at least 2 characters.";
    if (!form.email.trim())              e.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password)                  e.password = "Password is required.";
    else if (form.password.length < 8)   e.password = "Password must be at least 8 characters.";
    else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))
      e.password = "Password must include letters and numbers.";
    if (!form.confirm)                   e.confirm  = "Please confirm your password.";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    if (!form.role)                      e.role     = "Please select a role.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const newUser = {
      id: `u${Date.now()}`,
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      joinedDate: new Date().toISOString(),
      enrolledCourses: [],
      progress: {},
    };
    users.push(newUser);
    login(newUser);
    setSuccess(true);
    setTimeout(() => navigate("/"), 2000);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "0.625rem 1rem 0.625rem 2.5rem",
    borderRadius: "0.75rem",
    border: `1px solid ${errors[field] ? "#f87171" : inputBorder}`,
    backgroundColor: errors[field]
      ? darkMode ? "rgba(239,68,68,0.08)" : "#fef2f2"
      : inputBg,
    color: inputText,
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s",
  });

  const EyeBtn = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none transition-colors"
      style={{ background: "none", border: "none", padding: 0, color: iconCol }}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ background: heroBg }}
    >
      <style>{`input::placeholder { color: ${darkMode ? "#334155" : "#94a3b8"}; }`}</style>

      {/* ── Success Toast ── */}
      {success && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <div
            className="flex items-center gap-3 rounded-2xl shadow-2xl px-8 py-6 mx-4"
            style={{
              backgroundColor: darkMode ? "#0f1f3d" : "#ffffff",
              border: `1px solid ${darkMode ? "#166534" : "#bbf7d0"}`,
            }}
          >
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold" style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}>
                Account created successfully!
              </p>
              <p className="text-xs mt-0.5" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                Logging you in…
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">

          {/* ── Page Header ── */}
          <div className="flex flex-col items-center mb-6" aria-hidden="true">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-4"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
            >
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1
              className="font-extrabold tracking-tight text-center"
              style={{ fontSize: "clamp(2.35rem, 5vw, 3rem)", color: headingCol }}
            >
              Begin Your Journey
            </h1>
            <p className="text-sm mt-1" style={{ color: subCol }}>
              Join CourseHub and start learning today
            </p>
          </div>

          {/* ── Card ── */}
          <div
            className="rounded-2xl shadow-2xl px-6 sm:px-8 py-8 transition-colors duration-300"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
            }}
          >
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: labelCol }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: iconCol }}
                    aria-hidden="true"
                  />
                  <input
                    id="name"
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    style={inputStyle("name")}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" role="alert" className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: labelCol }}
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: iconCol }}
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    style={inputStyle("email")}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: labelCol }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: iconCol }}
                    aria-hidden="true"
                  />
                  <input
                    id="password"
                    value={form.password}
                    onChange={e => update("password", e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    style={{ ...inputStyle("password"), paddingRight: "2.5rem" }}
                  />
                  <EyeBtn show={showPassword} onToggle={() => setShowPassword(p => !p)} />
                </div>
                {errors.password && (
                  <p id="password-error" role="alert" className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirm"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: labelCol }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: iconCol }}
                    aria-hidden="true"
                  />
                  <input
                    id="confirm"
                    value={form.confirm}
                    onChange={e => update("confirm", e.target.value)}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirm}
                    aria-describedby={errors.confirm ? "confirm-error" : undefined}
                    style={{ ...inputStyle("confirm"), paddingRight: "2.5rem" }}
                  />
                  <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
                </div>
                {errors.confirm && (
                  <p id="confirm-error" role="alert" className="text-xs text-red-500">{errors.confirm}</p>
                )}
              </div>

              {/* Role */}
              <fieldset className="flex flex-col gap-1.5">
                <legend
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: labelCol }}
                >
                  I am a...
                </legend>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  {[
                    { value: "student",    label: "Student",    icon: <GraduationCap className="w-5 h-5" />, sub: "I want to learn" },
                    { value: "instructor", label: "Instructor", icon: <BookOpen      className="w-5 h-5" />, sub: "I want to teach" },
                  ].map(({ value, label, icon, sub }) => {
                    const isSelected = form.role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => update("role", value)}
                        aria-pressed={isSelected}
                        className="flex flex-col items-center gap-1 rounded-xl py-4 px-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/40"
                        style={{
                          border: `2px solid ${isSelected ? "#1976D2" : darkMode ? "#1a3a6b" : "#e2e8f0"}`,
                          backgroundColor: isSelected
                            ? darkMode ? "rgba(25,118,210,0.15)" : "#E3F2FD"
                            : darkMode ? "#0a1628" : "#ffffff",
                        }}
                        onMouseEnter={e => {
                          if (!isSelected)
                            e.currentTarget.style.borderColor = darkMode ? "#2d5fc4" : "#93c5fd";
                        }}
                        onMouseLeave={e => {
                          if (!isSelected)
                            e.currentTarget.style.borderColor = darkMode ? "#1a3a6b" : "#e2e8f0";
                        }}
                      >
                        <span
                          style={{ color: isSelected ? "#1976D2" : iconCol }}
                          aria-hidden="true"
                        >
                          {icon}
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: isSelected ? "#1976D2" : darkMode ? "#cbd5e1" : "#374151" }}
                        >
                          {label}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: darkMode ? "#64748b" : "#94a3b8" }}
                        >
                          {sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.role && (
                  <p role="alert" className="text-xs text-red-500">{errors.role}</p>
                )}
              </fieldset>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow transition-colors duration-200 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/50 focus:ring-offset-2"
                style={{ backgroundColor: "#1976D2" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}
              >
                Create My Account
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm mt-6" style={{ color: linkSubCol }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold transition-colors duration-200"
                style={{ color: "#1976D2" }}
                onMouseEnter={e => (e.currentTarget.style.color = darkMode ? "#60a5fa" : "#1565C0")}
                onMouseLeave={e => (e.currentTarget.style.color = "#1976D2")}
              >
                Log In
              </Link>
            </p>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: footerCol }}>
            © {new Date().getFullYear()} CourseHub. Learn anytime, anywhere.
          </p>
        </div>
      </main>
    </div>
  );
}