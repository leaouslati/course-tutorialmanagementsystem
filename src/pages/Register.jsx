import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Eye, EyeOff, Mail, Lock, UserPlus, CheckCircle, AlertCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email is invalid.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Minimum 8 characters.";
    if (!form.confirmPassword) e.confirmPassword = "Confirm your password.";
    else if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    return e;
  };

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => navigate("/login"), 1800);
      return () => clearTimeout(t);
    }
  }, [success, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSuccess(true);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const inputClass = (field) =>
    `w-full rounded-xl border px-3 py-2 text-sm transition focus:outline-none ${
      errors[field] ? "border-red-400 focus:border-red-400" : "border-slate-300 focus:border-[#1976D2]"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2] text-white">
      <Navbar />
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <UserPlus className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold">Create Your Account</h2>
            <p className="mt-2 text-sm text-blue-100">Join the community and start learning today.</p>
          </div>

          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2 text-sm text-emerald-800">
              <CheckCircle className="h-4 w-4" />
              Registration successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-blue-100">Name</label>
              <div className="relative">
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass("name")}
                  placeholder="Jane Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-200">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-blue-100">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200" />
                <input
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className={`${inputClass("email")} pl-9`}
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-200">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-blue-100">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  className={`${inputClass("password")} pl-9 pr-10`}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-200"
                  style={{ background: "none", border: "none" }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-200">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-blue-100">Confirm Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                  className={`${inputClass("confirmPassword")} pl-9 pr-10`}
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-200"
                  style={{ background: "none", border: "none" }}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-200">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#1976D2] transition hover:bg-blue-50"
            >
              Create Account
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-blue-100">
            Already have an account? <Link to="/login" className="font-bold text-white underline">Login</Link>
          </p>

          <p className="mt-6 text-center text-xs text-blue-200">© {new Date().getFullYear()} CourseHub. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
