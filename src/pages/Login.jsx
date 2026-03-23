import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Eye, EyeOff, Mail, Lock, BookOpen, CheckCircle, AlertCircle, KeyRound, X } from "lucide-react";
import { users } from "../data/mockdata";
import { useAuth } from "./AuthContext";

function ForgotPasswordModal({ onClose }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwErrors, setPwErrors] = useState({});
  const [done, setDone] = useState(false);

  const EyeBtn = ({ show, onToggle, label }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600"
      style={{ background: "none", border: "none", padding: 0 }}
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
    if (!newPw)                e.newPw     = "Password is required.";
    else if (newPw.length < 8) e.newPw     = "Password must be at least 8 characters.";
    else if (!/[A-Za-z]/.test(newPw) || !/[0-9]/.test(newPw)) e.newPw = "Must include letters and numbers.";
    if (!confirmPw)            e.confirmPw = "Please confirm your password.";
    else if (confirmPw !== newPw) e.confirmPw = "Passwords do not match.";
    if (Object.keys(e).length > 0) { setPwErrors(e); return; }
    localStorage.setItem(`pw_override_${email}`, newPw);
    setDone(true);
    setTimeout(() => onClose(), 1800);
  };

  const inputCls = (err) =>
    `w-full py-3 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/30 transition pl-10 pr-10 ${
      err ? "border-red-400" : "border-slate-300 focus:border-[#1976D2]"
    }`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4"
    >
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#1976D2]" aria-hidden="true" />
            <h2 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900">Reset Password</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 transition"
          >
            <X className="w-5 h-5 text-slate-500" aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-6 flex flex-col gap-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4" role="status" aria-live="polite">
              <CheckCircle className="w-10 h-10 text-green-500" aria-hidden="true" />
              <p className="text-sm font-bold text-slate-800">Password reset successfully!</p>
              <p className="text-xs text-slate-500">You can now log in with your new password.</p>
            </div>
          ) : step === "email" ? (
            <>
              <p className="text-sm text-slate-500">Enter the email address associated with your account.</p>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reset-email" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="reset-email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "reset-email-error" : undefined}
                    className={`w-full py-3 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/30 transition pl-10 pr-4 ${emailError ? "border-red-400" : "border-slate-300 focus:border-[#1976D2]"}`}
                  />
                </div>
                {emailError && <p id="reset-email-error" role="alert" className="text-xs text-red-500">{emailError}</p>}
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={onClose} className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 transition">Cancel</button>
                <button
                  onClick={handleEmailSubmit}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#1976D2]/50 transition"
                  style={{ backgroundColor: '#1976D2' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2196F3'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1976D2'}
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500">Choose a new password for <strong className="font-medium text-slate-700">{email}</strong>.</p>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="new-password" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="new-password"
                    value={newPw}
                    onChange={e => { setNewPw(e.target.value); setPwErrors(p => ({ ...p, newPw: "" })); }}
                    type={showNew ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    aria-invalid={!!pwErrors.newPw}
                    aria-describedby={pwErrors.newPw ? "new-pw-error" : undefined}
                    className={inputCls(pwErrors.newPw)}
                  />
                  <EyeBtn show={showNew} onToggle={() => setShowNew(!showNew)} label={showNew ? "Hide password" : "Show password"} />
                </div>
                {pwErrors.newPw && <p id="new-pw-error" role="alert" className="text-xs text-red-500">{pwErrors.newPw}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm-password" className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="confirm-password"
                    value={confirmPw}
                    onChange={e => { setConfirmPw(e.target.value); setPwErrors(p => ({ ...p, confirmPw: "" })); }}
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat new password"
                    aria-invalid={!!pwErrors.confirmPw}
                    aria-describedby={pwErrors.confirmPw ? "confirm-pw-error" : undefined}
                    className={inputCls(pwErrors.confirmPw)}
                  />
                  <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} label={showConfirm ? "Hide confirm password" : "Show confirm password"} />
                </div>
                {pwErrors.confirmPw && <p id="confirm-pw-error" role="alert" className="text-xs text-red-500">{pwErrors.confirmPw}</p>}
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep("email")} className="flex-1 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 transition">Back</button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#1976D2]/50 transition"
                  style={{ backgroundColor: '#1976D2' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2196F3'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1976D2'}
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

// Login Page
export default function Login() {
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

  const EyeBtn = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? "Hide password" : "Show password"}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:text-slate-600"
      style={{ background: "none", border: "none", padding: 0 }}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) {
      setForm(prev => ({ ...prev, email: saved }));
      setRememberMe(true);
    }
  }, []);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
    setAuthError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim())                                    e.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))  e.email    = "Enter a valid email address.";
    if (!form.password)                                        e.password = "Password is required.";
    else if (form.password.length < 8)                         e.password = "Password must be at least 8 characters.";
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
      if (!matchedUser) {
        setAuthError("Incorrect email or password. Please try again.");
        return;
      }
      if (rememberMe) localStorage.setItem("rememberedEmail", form.email);
      else localStorage.removeItem("rememberedEmail");
      login(matchedUser);
      setSuccess(true);
      const from = location.state?.from || "/";
      setTimeout(() => navigate(from, { replace: true }), 2000);
    }, 800);
  };

  const inputClass = (field) =>
    `w-full py-3 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1976D2]/30 transition ${
      errors[field] ? "border-red-400 focus:border-red-400" : "border-slate-300 focus:border-[#1976D2]"
    }`;

  const labelClass = "text-xs font-semibold text-slate-600 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2] flex flex-col">
      <style>{`input::placeholder { color: #cbd5e1; }`}</style>
      <Navbar />

      {/* Success toast */}
      {success && (
        <div role="status" aria-live="polite" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-6 sm:px-8 py-5 sm:py-6 border border-green-100 max-w-xs w-full sm:w-auto">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-slate-800">Logged in successfully!</p>
              <p className="text-xs text-slate-500 mt-0.5">Taking you home…</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div role="status" aria-live="polite" aria-label="Logging in, please wait" className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-6 sm:px-8 py-5 sm:py-6 border border-blue-100 max-w-xs w-full sm:w-auto">
            <svg className="animate-spin h-6 w-6 text-[#1976D2] flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-slate-800">Logging in…</p>
              <p className="text-xs text-slate-500 mt-0.5">Please wait</p>
            </div>
          </div>
        </div>
      )}

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-16">
        <div className="w-full max-w-sm sm:max-w-md">

          {/* Header */}
          <header className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-md mb-4" aria-hidden="true">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
            <p className="text-sm text-blue-200 mt-1 text-center">Sign in to continue your learning journey</p>
          </header>

          {/* Card */}
          <section className="bg-white rounded-2xl shadow-2xl border border-white/20 px-5 sm:px-8 py-6 sm:py-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="email"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`${inputClass("email")} pl-10 pr-4`}
                  />
                </div>
                {errors.email && <p id="email-error" role="alert" className="text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                  <input
                    id="password"
                    value={form.password}
                    onChange={e => update("password", e.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`${inputClass("password")} pl-10 pr-10`}
                  />
                  <EyeBtn show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                </div>
                {errors.password && <p id="password-error" role="alert" className="text-xs text-red-500">{errors.password}</p>}
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                className="self-end text-xs focus:outline-none transition"
style={{ color: '#1976D2', background: 'none', border: 'none', padding: 0 }}
onMouseEnter={e => e.currentTarget.style.color = '#2196F3'}
onMouseLeave={e => e.currentTarget.style.color = '#1976D2'}
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
                <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">Remember me</label>
              </div>

              {/* Auth error */}
              {authError && (
                <div role="alert" className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
                  <p className="text-xs text-red-600 font-medium">{authError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl py-3 text-sm font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-[#1976D2]/50 focus:ring-offset-2 transition mt-1"
                style={{ backgroundColor: '#1976D2' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2196F3'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1976D2'}
              >
                Log In
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold focus:outline-none focus:underline transition"
                style={{ color: '#1976D2' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2196F3'}
                onMouseLeave={e => e.currentTarget.style.color = '#1976D2'}
              >
                Sign Up
              </Link>
            </p>
          </section>

          <p className="text-center text-xs text-blue-200 mt-6">
            © {new Date().getFullYear()} CourseHub. Learn anytime, anywhere.
          </p>
        </div>
      </main>
    </div>
  );
}