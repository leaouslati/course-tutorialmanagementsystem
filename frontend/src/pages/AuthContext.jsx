import { createContext, useContext, useState } from "react";
import { authFetch } from "../api";

const AuthContext = createContext(null);

// Decodes the payload from a JWT without any library.
// A JWT is three base64url parts separated by dots — the middle one is the payload.
function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    // base64url → base64, then decode
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? decodeToken(token) : null;
  });
  const [userName, setUserName] = useState(() => localStorage.getItem("user_name") ?? null);

  // Store the token, decode it, then immediately fetch the display name so the
  // Navbar shows the correct name and role-based links without a page refresh.
  const login = async (token) => {
    localStorage.setItem("token", token);
    setCurrentUser(decodeToken(token));
    try {
      const res = await authFetch("/api/users/me");
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("user_name", data.name);
        setUserName(data.name);
      }
    } catch {}
  };

  // Clear the token from localStorage and reset user state
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    setCurrentUser(null);
    setUserName(null);
  };

  // Called after a profile name update so the Navbar reflects the change immediately
  const updateUserName = (name) => {
    localStorage.setItem("user_name", name);
    setUserName(name);
  };

  // ── Local UI state helpers (progress & bookmarks) ──────────────────────────
  // These are stored separately in localStorage and are not part of the JWT.

  const updateProgress = (courseId, doneLessons, totalLessons) => {
    if (!currentUser || !courseId) return;
    const newPct = totalLessons > 0
      ? Math.round((doneLessons / totalLessons) * 100)
      : 0;
    const key = `progress_${currentUser.id}`;
    const progress = JSON.parse(localStorage.getItem(key) || "{}");
    if (progress[courseId] === newPct) return;
    progress[courseId] = newPct;
    localStorage.setItem(key, JSON.stringify(progress));
    // Reflect in currentUser so components re-render
    setCurrentUser((prev) => ({ ...prev, progress: { ...prev?.progress, [courseId]: newPct } }));
  };

  const toggleBookmark = (courseId) => {
    if (!currentUser || !courseId) return;
    const key = `bookmarks_${currentUser.id}`;
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = saved.includes(courseId)
      ? saved.filter((id) => id !== courseId)
      : [...saved, courseId];
    localStorage.setItem(key, JSON.stringify(updated));
    setCurrentUser((prev) => ({ ...prev, savedCourses: updated }));
  };

  const isBookmarked = (courseId) => {
    return (currentUser?.savedCourses ?? []).includes(courseId);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, userName, login, logout, updateUserName, updateProgress, toggleBookmark, isBookmarked }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook — throw a descriptive error if used outside <AuthProvider>
export function useAuth() {
  return useContext(AuthContext);
}
