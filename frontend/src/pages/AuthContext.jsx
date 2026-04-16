import { createContext, useContext, useState } from "react";

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

  // Call with the JWT string returned from the API
  const login = (token) => {
    localStorage.setItem("token", token);
    setCurrentUser(decodeToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
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
      value={{ currentUser, login, logout, updateProgress, toggleBookmark, isBookmarked }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
