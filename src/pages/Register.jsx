import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, BookOpen, GraduationCap, CheckCircle } from "lucide-react";
import { useAuth } from "./AuthContext";
import { users } from "../data/mockdata";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))
      e.password = "Password must include letters and numbers.";
    if (!form.confirm) e.confirm = "Please confirm your password.";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    if (!form.role) e.role = "Please select a role.";
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

  const inputBase = (field) =>
    `w-full py-2.5 pl-10 pr-4 rounded-xl border text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/30 ${
      errors[field]
        ? "border-red-400 focus:border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-500"
        : "border-slate-300 dark:border-slate-600 focus:border-[#1976D2] bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
    }`;

  const EyeBtn = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none transition-colors"
      style={{ background: "none", border: "none", padding: 0 }}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2] dark:from-[#0a2f6e] dark:via-[#0d3d8a] dark:to-[#1251a8] flex flex-col transition-colors duration-300">
      <style>{`
        input::placeholder { color: #94a3b8; }
        .dark input::placeholder { color: #64748b; }
      `}</style>

      {/* Success Toast */}
      {success && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl px-8 py-6 border border-green-100 dark:border-green-800 mx-4">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Account created successfully!</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Logging you in…</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">

          {/* Header */}
          <div className="flex flex-col items-center mb-6" aria-hidden="true">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-md mb-4">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1
              className="font-extrabold text-white tracking-tight text-center"
              style={{ fontSize: "clamp(2.35rem, 5vw, 3rem)" }}
            >
              Begin Your Journey
            </h1>
            <p className="text-sm text-blue-200 dark:text-blue-300 mt-1">
              Join CourseHub and start learning today
            </p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700 px-6 sm:px-8 py-8 transition-colors duration-300">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="name"
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputBase("name")}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" role="alert" className="text-xs text-red-500 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="email"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    type="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputBase("email")}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs text-red-500 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="password"
                    value={form.password}
                    onChange={e => update("password", e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`${inputBase("password")} pr-10`}
                  />
                  <EyeBtn show={showPassword} onToggle={() => setShowPassword(p => !p)} />
                </div>
                {errors.password && (
                  <p id="password-error" role="alert" className="text-xs text-red-500 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="confirm"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="confirm"
                    value={form.confirm}
                    onChange={e => update("confirm", e.target.value)}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirm}
                    aria-describedby={errors.confirm ? "confirm-error" : undefined}
                    className={`${inputBase("confirm")} pr-10`}
                  />
                  <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(p => !p)} />
                </div>
                {errors.confirm && (
                  <p id="confirm-error" role="alert" className="text-xs text-red-500 dark:text-red-400">
                    {errors.confirm}
                  </p>
                )}
              </div>

              {/* Role */}
              <fieldset className="flex flex-col gap-1.5">
                <legend className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
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
                        className={`flex flex-col items-center gap-1 rounded-xl border-2 py-4 px-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/40 ${
                          isSelected
                            ? "border-[#1976D2] bg-[#E3F2FD] dark:bg-blue-900/30 dark:border-[#1976D2]"
                            : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-[#1976D2]/50"
                        }`}
                      >
                        <span className={isSelected ? "text-[#1976D2]" : "text-slate-400 dark:text-slate-400"} aria-hidden="true">
                          {icon}
                        </span>
                        <span className={`text-sm font-semibold ${isSelected ? "text-[#1976D2]" : "text-slate-700 dark:text-slate-200"}`}>
                          {label}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{sub}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.role && (
                  <p role="alert" className="text-xs text-red-500 dark:text-red-400">
                    {errors.role}
                  </p>
                )}
              </fieldset>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow transition-colors duration-200 mt-1 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/50 focus:ring-offset-2"
                style={{ backgroundColor: "#1976D2" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2196F3"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1976D2"}
              >
                Create My Account
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#1976D2] hover:text-[#1565C0] transition-colors duration-200"
              >
                Log In
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-blue-200 dark:text-blue-300 mt-6">
            © {new Date().getFullYear()} CourseHub. Learn anytime, anywhere.
          </p>
        </div>
      </main>
    </div>
  );
}