import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Eye, EyeOff, Mail, Lock, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import { users } from "../data/mockdata";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
    // TODO: wire to auth
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    }, 1500);
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
            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            <div>
              <p className="text-sm font-bold text-slate-800">Logging in…</p>
              <p className="text-xs text-slate-500 mt-0.5">Please wait</p>
            </div>
          </div>
        </div>
      )}

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
                    className={`${inputClass("email")} pl-10 pr-4`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.password} onChange={e => update("password", e.target.value)}
                    type={showPassword ? "text" : "password"} placeholder="Enter your password"
                    className={`${inputClass("password")} pl-10 pr-10`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    style={{ background: 'none', border: 'none', padding: 0 }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-[#1976D2] cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              {/* Auth error */}
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
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1976D2'}
              >
                Log In
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold transition" style={{ color: '#1976D2' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2196F3'}
                onMouseLeave={e => e.currentTarget.style.color = '#1976D2'}
              >
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