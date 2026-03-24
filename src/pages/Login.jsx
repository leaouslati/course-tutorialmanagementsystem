import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, BookOpen, CheckCircle, AlertCircle, KeyRound, X } from "lucide-react";
import { users } from "../data/mockdata";
import { useAuth } from "./AuthContext";

/* ─── Forgot Password Modal ───────────────────────────────────────────── */
function ForgotPasswordModal({ onClose, darkMode }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwErrors, setPwErrors] = useState({});
  const [done, setDone] = useState(false);

  // color tokens
  const modalBg = darkMode ? "#0f1f3d" : "#ffffff";
  const modalBorder = darkMode ? "#1a3a6b" : "#f1f5f9";
  const headingCol = darkMode ? "#f1f5f9" : "#0f172a";
  const bodyText = darkMode ? "#94a3b8" : "#64748b";
  const labelCol = darkMode ? "#94a3b8" : "#475569";
  const inputBg = darkMode ? "#0a1628" : "#ffffff";
  const inputText = darkMode ? "#f1f5f9" : "#1e293b";
  const inputBorder = darkMode ? "#1a3a6b" : "#cbd5e1";
  const iconCol = darkMode ? "#64748b" : "#94a3b8";

  const EyeBtn = ({ show, onToggle, label }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
      style={{ background: "none", border: "none", padding: 0, color: iconCol }}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  const handleEmailSubmit = () => {
    if (!email.trim()) { setEmailError("Email is required."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Enter a valid email address."); return; }
    if (!users.find(u => u.email === email)) { setEmailError("No account found with this email."); return; }
    setEmailError("");
    setStep("reset");
  };

  const handleReset = () => {
    const e = {};
    if (!newPw) e.newPw = "Password is required.";
    else if (newPw.length < 8) e.newPw = "Password must be at least 8 characters.";
    else if (!/[A-Za-z]/.test(newPw) || !/[0-9]/.test(newPw)) e.newPw = "Must include letters and numbers.";
    if (!confirmPw) e.confirmPw = "Please confirm your password.";
    else if (confirmPw !== newPw) e.confirmPw = "Passwords do not match.";
    if (Object.keys(e).length > 0) { setPwErrors(e); return; }
    localStorage.setItem(`pw_override_${email}`, newPw);
    setDone(true);
    setTimeout(() => onClose(), 1800);
  };

  const inputCls = (err) => ({
    width: "100%",
    padding: "0.75rem 2.5rem",
    borderRadius: "0.75rem",
    border: `1px solid ${err ? "#f87171" : inputBorder}`,
    backgroundColor: inputBg,
    color: inputText,
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s",
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-0 sm:px-4"
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: modalBg, border: `1px solid ${modalBorder}` }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 sm:px-6 py-4 border-b"
          style={{ borderColor: modalBorder }}
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#1976D2]" aria-hidden="true" />
            <h2
              id="modal-title"
              className="text-base sm:text-lg font-bold"
              style={{ color: headingCol }}
            >
              Reset Password
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 transition focus:outline-none"
            style={{ color: iconCol }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f1f5f9")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-6 flex flex-col gap-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4" role="status" aria-live="polite">
              <CheckCircle className="w-10 h-10 text-green-500" aria-hidden="true" />
              <p className="text-sm font-bold" style={{ color: headingCol }}>Password reset successfully!</p>
              <p className="text-xs" style={{ color: bodyText }}>You can now log in with your new password.</p>
            </div>

          ) : step === "email" ? (
            <>
              <p className="text-sm" style={{ color: bodyText }}>
                Enter the email address associated with your account.
              </p>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reset-email"
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: labelCol }}
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: iconCol }} aria-hidden="true" />
                  <input
                    id="reset-email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "reset-email-error" : undefined}
                    style={inputCls(emailError)}
                  />
                </div>
                {emailError && <p id="reset-email-error" role="alert" className="text-xs text-red-500">{emailError}</p>}
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold transition"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid ${darkMode ? "#1a3a6b" : "#cbd5e1"}`,
                    color: darkMode ? "#94a3b8" : "#475569",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailSubmit}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition"
                  style={{ backgroundColor: "#1976D2" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}
                >
                  Continue
                </button>
              </div>
            </>

          ) : (
            <>
              <p className="text-sm" style={{ color: bodyText }}>
                Choose a new password for{" "}
                <strong className="font-medium" style={{ color: headingCol }}>{email}</strong>.
              </p>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wider" style={{ color: labelCol }}>
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: iconCol }} aria-hidden="true" />
                  <input
                    id="new-password"
                    value={newPw}
                    onChange={e => { setNewPw(e.target.value); setPwErrors(p => ({ ...p, newPw: "" })); }}
                    type={showNew ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    aria-invalid={!!pwErrors.newPw}
                    style={inputCls(pwErrors.newPw)}
                  />
                  <EyeBtn show={showNew} onToggle={() => setShowNew(!showNew)} label={showNew ? "Hide password" : "Show password"} />
                </div>
                {pwErrors.newPw && <p id="new-pw-error" role="alert" className="text-xs text-red-500">{pwErrors.newPw}</p>}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm-password" className="text-xs font-semibold uppercase tracking-wider" style={{ color: labelCol }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: iconCol }} aria-hidden="true" />
                  <input
                    id="confirm-password"
                    value={confirmPw}
                    onChange={e => { setConfirmPw(e.target.value); setPwErrors(p => ({ ...p, confirmPw: "" })); }}
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat new password"
                    aria-invalid={!!pwErrors.confirmPw}
                    style={inputCls(pwErrors.confirmPw)}
                  />
                  <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} label={showConfirm ? "Hide confirm password" : "Show confirm password"} />
                </div>
                {pwErrors.confirmPw && <p id="confirm-pw-error" role="alert" className="text-xs text-red-500">{pwErrors.confirmPw}</p>}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep("email")}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold transition"
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid ${darkMode ? "#1a3a6b" : "#cbd5e1"}`,
                    color: darkMode ? "#94a3b8" : "#475569",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = darkMode ? "#1a3a6b" : "#f8fafc")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Back
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition"
                  style={{ backgroundColor: "#1976D2" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}
                >
                  Reset Password
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Login Page ──────────────────────────────────────────────────────── */
export default function Login({ darkMode = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // color tokens
  const cardBg = darkMode ? "#0f1f3d" : "#ffffff";
  const cardBorder = darkMode ? "#1a3a6b" : "rgba(255,255,255,0.2)";
  const headingCol = darkMode ? "#f1f5f9" : "#ffffff";
  const subCol = darkMode ? "#94a3b8" : "#bfdbfe";
  const labelCol = darkMode ? "#94a3b8" : "#475569";
  const inputBg = darkMode ? "#0a1628" : "#ffffff";
  const inputText = darkMode ? "#f1f5f9" : "#1e293b";
  const inputBorder = darkMode ? "#1a3a6b" : "#cbd5e1";
  const iconCol = darkMode ? "#64748b" : "#94a3b8";
  const checkboxCol = darkMode ? "#94a3b8" : "#475569";
  const footerCol = darkMode ? "#64748b" : "#bfdbfe";

  const heroBg = darkMode
    ? "linear-gradient(135deg, #020b18 0%, #041530 25%, #0a2550 50%, #0d3272 65%, #1048a0 85%, #1565C0 100%)"
    : "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)";

  const EyeBtn = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
      style={{ background: "none", border: "none", padding: 0, color: iconCol }}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) { setForm(prev => ({ ...prev, email: saved })); setRememberMe(true); }
  }, []);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
    setAuthError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    const matchedUser = users.find(u => {
      if (u.email !== form.email) return false;
      const override = localStorage.getItem(`pw_override_${u.email}`);
      return (override ?? u.password) === form.password;
    });
    setTimeout(() => {
      setLoading(false);
      if (!matchedUser) { setAuthError("Incorrect email or password. Please try again."); return; }
      if (rememberMe) localStorage.setItem("rememberedEmail", form.email);
      else localStorage.removeItem("rememberedEmail");
      login(matchedUser);
      setSuccess(true);
      const from = location.state?.from || "/";
      setTimeout(() => navigate(from, { replace: true }), 2000);
    }, 800);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "0.75rem 2.5rem",
    borderRadius: "0.75rem",
    border: `1px solid ${errors[field] ? "#f87171" : inputBorder}`,
    backgroundColor: inputBg,
    color: inputText,
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s",
  });

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ background: heroBg }}
    >
      <style>{`input::placeholder { color: ${darkMode ? "#334155" : "#cbd5e1"}; }`}</style>

      {/* ── Success toast ── */}
      {success && (
        <div role="status" aria-live="polite" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="flex items-center gap-3 rounded-2xl shadow-2xl px-6 sm:px-8 py-5 sm:py-6 max-w-xs w-full sm:w-auto"
            style={{
              backgroundColor: darkMode ? "#0f1f3d" : "#ffffff",
              border: `1px solid ${darkMode ? "#166534" : "#bbf7d0"}`,
            }}
          >
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold" style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}>Logged in successfully!</p>
              <p className="text-xs mt-0.5" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>Taking you home…</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Loading overlay ── */}
      {loading && (
        <div role="status" aria-live="polite" aria-label="Logging in, please wait" className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div
            className="flex items-center gap-3 rounded-2xl shadow-2xl px-6 sm:px-8 py-5 sm:py-6 max-w-xs w-full sm:w-auto"
            style={{
              backgroundColor: darkMode ? "#0f1f3d" : "#ffffff",
              border: `1px solid ${darkMode ? "#1a3a6b" : "#bfdbfe"}`,
            }}
          >
            <svg className="animate-spin h-6 w-6 text-[#1976D2] flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <div>
              <p className="text-sm font-bold" style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}>Logging in…</p>
              <p className="text-xs mt-0.5" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>Please wait</p>
            </div>
          </div>
        </div>
      )}

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} darkMode={darkMode} />}

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-16">
        <div className="w-full max-w-sm sm:max-w-md">

          {/* ── Page header ── */}
          <header className="flex flex-col items-center mb-6" aria-hidden="true">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-md mb-4"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
            >
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1
              className="font-extrabold tracking-tight text-center"
              style={{ fontSize: "clamp(2.35rem, 4vw, 3rem)", color: headingCol }}
            >
              Welcome Back
            </h1>
            <p className="text-sm text-center" style={{ color: subCol }}>
              Sign in to continue your learning journey
            </p>
          </header>

          {/* ── Card ── */}
          <section
            className="rounded-2xl shadow-2xl px-5 sm:px-8 py-6 sm:py-8"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
            }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider" style={{ color: labelCol }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: iconCol }} aria-hidden="true" />
                  <input
                    id="email"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    style={inputStyle("email")}
                  />
                </div>
                {errors.email && <p id="email-error" role="alert" className="text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider" style={{ color: labelCol }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: iconCol }} aria-hidden="true" />
                  <input
                    id="password"
                    value={form.password}
                    onChange={e => update("password", e.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    style={{ ...inputStyle("password"), paddingRight: "2.5rem" }}
                  />
                  <EyeBtn show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                </div>
                {errors.password && <p id="password-error" role="alert" className="text-xs text-red-500">{errors.password}</p>}
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="self-end text-xs focus:outline-none transition"
                  style={{ color: "#1976D2", background: "none", border: "none", padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = darkMode ? "#60a5fa" : "#2196F3")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#1976D2")}
                >
                  Forgot password?
                </button>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-[#1976D2] cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm cursor-pointer select-none"
                  style={{ color: checkboxCol }}
                >
                  Remember me
                </label>
              </div>

              {/* Auth error */}
              {authError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-xl px-4 py-3"
                  style={{
                    backgroundColor: darkMode ? "rgba(239,68,68,0.1)" : "#fef2f2",
                    border: `1px solid ${darkMode ? "#7f1d1d" : "#fecaca"}`,
                  }}
                >
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
                  <p className="text-xs text-red-500 font-medium">{authError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl py-3 text-sm font-semibold text-white shadow transition mt-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1976D2]"
                style={{ backgroundColor: "#1976D2" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}
              >
                Log In
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: darkMode ? "#64748b" : "#64748b" }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold focus:outline-none focus:underline transition"
                style={{ color: "#1976D2" }}
                onMouseEnter={e => (e.currentTarget.style.color = darkMode ? "#60a5fa" : "#2196F3")}
                onMouseLeave={e => (e.currentTarget.style.color = "#1976D2")}
              >
                Sign Up
              </Link>
            </p>
          </section>

          <p className="text-center text-xs mt-6" style={{ color: footerCol }}>
            © {new Date().getFullYear()} CourseHub. Learn anytime, anywhere.
          </p>
        </div>
      </main>
    </div>
  );
}