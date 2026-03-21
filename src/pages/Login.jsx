import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    const user = users.find(u => u.email === email);
    if (user) user.password = newPw;
    setDone(true);
    setTimeout(() => onClose(), 1800);
  };

  const inputCls = (err) =>
    `w-full py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition pl-10 pr-10 ${
      err ? "border-red-400" : "border-slate-300 focus:border-[#1976D2]"
    }`;

  const EyeBtn = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none" style={{ background: 'none', border: 'none', padding: 0 }}>
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#1976D2]" />
            <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100 transition">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="px-6 py-6 flex flex-col gap-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
              <p className="text-sm font-bold text-slate-800">Password reset successfully!</p>
              <p className="text-xs text-slate-500">You can now log in with your new password.</p>
            </div>
          ) : step === "email" ? (
            <>
              <p className="text-sm text-slate-500">Enter the email address associated with your account.</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={email} onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                    type="email" placeholder="your@email.com"
                    className={`w-full py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition pl-10 pr-4 ${emailError ? "border-red-400" : "border-slate-300 focus:border-[#1976D2]"}`}
                  />
                </div>
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={onClose} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                <button onClick={handleEmailSubmit} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition"
                  style={{ backgroundColor: '#1976D2' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2196F3'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1976D2'}>
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500">Choose a new password for <span className="font-medium text-slate-700">{email}</span>.</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={newPw} onChange={e => { setNewPw(e.target.value); setPwErrors(p => ({ ...p, newPw: "" })); }}
                    type={showNew ? "text" : "password"} placeholder="At least 8 characters" className={inputCls(pwErrors.newPw)} />
                  <EyeBtn show={showNew} onToggle={() => setShowNew(!showNew)} />
                </div>
                {pwErrors.newPw && <p className="text-xs text-red-500">{pwErrors.newPw}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setPwErrors(p => ({ ...p, confirmPw: "" })); }}
                    type={showConfirm ? "text" : "password"} placeholder="Repeat new password" className={inputCls(pwErrors.confirmPw)} />
                  <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                </div>
                {pwErrors.confirmPw && <p className="text-xs text-red-500">{pwErrors.confirmPw}</p>}
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setStep("email")} className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">Back</button>
                <button onClick={handleReset} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition"
                  style={{ backgroundColor: '#1976D2' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2196F3'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1976D2'}>
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

// ---------- Login Page ----------
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

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
    if (!form.email.trim())                                   e.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email    = "Enter a valid email address.";
    if (!form.password)                                       e.password = "Password is required.";
    else if (form.password.length < 8)                        e.password = "Password must be at least 8 characters.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const matchedUser = users.find(u => u.email === form.email && u.password === form.password);

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
      setTimeout(() => navigate("/"), 2000);
    }, 800);
  };

  const inputClass = (field) =>
    `w-full py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
      errors[field] ? "border-red-400 focus:border-red-400" : "border-slate-300 focus:border-[#1976D2]"
    }`;

  const labelClass = "text-xs font-semibold text-slate-600 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2] flex flex-col">
      <style>{`input::placeholder { color: #cbd5e1; }`}</style>
      <Navbar />

      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-8 py-6 border border-green-100">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-800">Logged in successfully!</p>
              <p className="text-xs text-slate-500 mt-0.5">Taking you home…</p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-8 py-6 border border-blue-100">
            <svg className="animate-spin h-6 w-6 text-[#1976D2]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-md mb-4">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
            <p className="text-sm text-blue-200 mt-1">Sign in to continue your learning journey</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 px-8 py-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.email} onChange={e => update("email", e.target.value)}
                    type="email" placeholder="your@email.com"
                    className={`${inputClass("email")} pl-10 pr-4`} />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.password} onChange={e => update("password", e.target.value)}
                    type={showPassword ? "text" : "password"} placeholder="Enter your password"
                    className={`${inputClass("password")} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    style={{ background: 'none', border: 'none', padding: 0 }}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                <button type="button" onClick={() => setShowForgot(true)}
                  className="self-end text-xs font-medium focus:outline-none transition"
                  style={{ color: '#1976D2', background: 'none', border: 'none', padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#2196F3'}
                  onMouseLeave={e => e.currentTarget.style.color = '#1976D2'}>
                  Forgot password?
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input id="rememberMe" type="checkbox" checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-[#1976D2] cursor-pointer" />
                <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">Remember me</label>
              </div>

              {authError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-600 font-medium">{authError}</p>
                </div>
              )}

              <button type="submit"
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow transition mt-1"
                style={{ backgroundColor: '#1976D2' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2196F3'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1976D2'}>
                Log In
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold transition" style={{ color: '#1976D2' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2196F3'}
                onMouseLeave={e => e.currentTarget.style.color = '#1976D2'}>
                Sign Up
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-blue-200 mt-6">
            © {new Date().getFullYear()} CourseHub. Learn anytime, anywhere.
          </p>
        </div>
      </main>
    </div>
  );
}