import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Eye, EyeOff, Mail, Lock, User, BookOpen, GraduationCap, CheckCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
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
    if (!form.name.trim())                        e.name     = "Full name is required.";
    else if (form.name.trim().length < 2)         e.name     = "Name must be at least 2 characters.";
    if (!form.email.trim())                       e.email    = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password)                           e.password = "Password is required.";
    else if (form.password.length < 8)            e.password = "Password must be at least 8 characters.";
    else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) e.password = "Password must include letters and numbers.";
    if (!form.confirm)                            e.confirm  = "Please confirm your password.";
    else if (form.confirm !== form.password)      e.confirm  = "Passwords do not match.";
    if (!form.role)                               e.role     = "Please select a role.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSuccess(true);
    setTimeout(() => navigate("/"), 2000);
  };

  const inputClass = (field) =>
    `w-full py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none transition ${
      errors[field] ? "border-red-400 focus:border-red-400" : "border-slate-300 focus:border-[#1976D2]"
    }`;

  const labelClass = "text-xs font-semibold text-slate-600 uppercase tracking-wider";

  const EyeBtn = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
      style={{ background: 'none', border: 'none', padding: 0 }}
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2] flex flex-col">
      <style>{`input::placeholder { color: #cbd5e1; }`}</style>
      <Navbar />

      {/* Success Toast */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-8 py-6 border border-green-100">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-800">Account created successfully!</p>
              <p className="text-xs text-slate-500 mt-0.5">Taking you home…</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-md mb-4">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Begin Your Journey</h1>
            <p className="text-sm text-blue-200 mt-1">Join CourseHub and start learning today</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-white/20 px-8 py-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.name} onChange={e => update("name", e.target.value)}
                    type="text" placeholder="Your full name"
                    className={`${inputClass("name")} pl-10 pr-4`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.password} onChange={e => update("password", e.target.value)}
                    type={showPassword ? "text" : "password"} placeholder="At least 8 characters"
                    className={`${inputClass("password")} pl-10 pr-10`}
                  />
                  <EyeBtn show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.confirm} onChange={e => update("confirm", e.target.value)}
                    type={showConfirm ? "text" : "password"} placeholder="Repeat your password"
                    className={`${inputClass("confirm")} pl-10 pr-10`}
                  />
                  <EyeBtn show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                </div>
                {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "student",    label: "Student",    icon: <GraduationCap className="w-5 h-5" />, sub: "I want to learn" },
                    { value: "instructor", label: "Instructor", icon: <BookOpen className="w-5 h-5" />,      sub: "I want to teach" },
                  ].map(({ value, label, icon, sub }) => (
                    <button key={value} type="button" onClick={() => update("role", value)}
                      className="flex flex-col items-center gap-1 rounded-xl border-2 py-4 px-3 transition-all duration-200 focus:outline-none"
                      style={form.role === value
                        ? { borderColor: '#1976D2', backgroundColor: '#E3F2FD' }
                        : { borderColor: '#e2e8f0', backgroundColor: '#fff' }}
                    >
                      <span style={{ color: form.role === value ? '#1976D2' : '#94a3b8' }}>{icon}</span>
                      <span className={`text-sm font-semibold ${form.role === value ? "text-[#1976D2]" : "text-slate-700"}`}>{label}</span>
                      <span className="text-xs text-slate-400">{sub}</span>
                    </button>
                  ))}
                </div>
                {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
              </div>

              {/* Submit */}
              <button type="submit"
                className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow transition mt-1"
                style={{ backgroundColor: '#1976D2' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2196F3'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1976D2'}
              >
                Create My Account
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold transition" style={{ color: '#1976D2' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2196F3'}
                onMouseLeave={e => e.currentTarget.style.color = '#1976D2'}
              >
                Log In
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