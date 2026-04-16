import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, BookOpen, CheckCircle, AlertCircle, KeyRound, X } from "lucide-react";
import { useAuth } from "./AuthContext";
import Button from "../components/Button";

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

  const PASSWORD_RULES = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
    { label: "One lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
    { label: "One number (0–9)", test: (p) => /[0-9]/.test(p) },
    { label: "One special character (!@#$…)", test: (p) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p) },
  ];

  const handleEmailSubmit = () => {
    if (!email.trim()) return setEmailError("Email is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setEmailError("Enter a valid email address.");

    setEmailError("");
    setStep("reset");
  };

  // ✅ FIXED: API call instead of localStorage
  const handleReset = async () => {
    const e = {};

    if (!newPw) {
      e.newPw = "Password is required.";
    } else {
      const failedRule = PASSWORD_RULES.find((r) => !r.test(newPw));
      if (failedRule) e.newPw = failedRule.label + " required.";
    }

    if (!confirmPw) e.confirmPw = "Please confirm your password.";
    else if (confirmPw !== newPw) e.confirmPw = "Passwords do not match.";

    if (Object.keys(e).length > 0) {
      setPwErrors(e);
      return;
    }

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword: newPw,
        }),
      });

      setDone(true);
      setTimeout(() => onClose(), 1800);
    } catch (err) {
      setPwErrors({
        newPw: "Failed to reset password. Try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Reset Password</h2>

        {done ? (
          <div className="text-green-500 flex items-center gap-2">
            <CheckCircle /> Password reset successfully
          </div>
        ) : step === "email" ? (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border p-2 rounded mb-2"
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <Button onClick={handleEmailSubmit}>Continue</Button>
          </>
        ) : (
          <>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="New password"
              className="w-full border p-2 rounded mb-2"
            />
            {pwErrors.newPw && <p className="text-red-500 text-sm">{pwErrors.newPw}</p>}

            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Confirm password"
              className="w-full border p-2 rounded mb-2"
            />
            {pwErrors.confirmPw && (
              <p className="text-red-500 text-sm">{pwErrors.confirmPw}</p>
            )}

            <Button onClick={handleReset}>Reset Password</Button>
          </>
        )}

        <button onClick={onClose} className="mt-3 text-sm text-gray-500">
          Close
        </button>
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

  const update = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors({});
    setAuthError("");
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  // ✅ FIXED LOGIN (API + JWT + real error)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      setLoading(true);
      setAuthError("");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError(data.message || "Incorrect email or password.");
        return;
      }

      localStorage.setItem("token", data.token);
      login(data.user);

      setSuccess(true);

      const from = location.state?.from || "/";
      setTimeout(() => navigate(from, { replace: true }), 2000);
    } catch (err) {
      setAuthError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showForgot && (
        <ForgotPasswordModal
          onClose={() => setShowForgot(false)}
          darkMode={darkMode}
        />
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-20">
        <input
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="Email"
          className="w-full border p-2 mb-2"
        />

        <input
          type={showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          placeholder="Password"
          className="w-full border p-2 mb-2"
        />

        {authError && <p className="text-red-500 text-sm">{authError}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <button
          type="button"
          onClick={() => setShowForgot(true)}
          className="text-sm text-blue-500 mt-2"
        >
          Forgot password?
        </button>
      </form>
    </div>
  );
}