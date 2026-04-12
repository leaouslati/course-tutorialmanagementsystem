import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const updateUser = (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem("currentUser", JSON.stringify(updated));
  };

  /**
   * Update progress % for a course based on how many lessons are done.
   *
   * @param {string} courseId     - e.g. 'c1'
   * @param {number} doneLessons  - number of completed lessons so far
   * @param {number} totalLessons - total lessons in the course
   */
  const updateProgress = (courseId, doneLessons, totalLessons) => {
    if (!currentUser || !courseId) return;
    const newPct = totalLessons > 0
      ? Math.round((doneLessons / totalLessons) * 100)
      : 0;
    // Skip if unchanged
    if (currentUser.progress?.[courseId] === newPct) return;
    const updated = {
      ...currentUser,
      progress: { ...(currentUser.progress ?? {}), [courseId]: newPct },
    };
    setCurrentUser(updated);
    localStorage.setItem("currentUser", JSON.stringify(updated));
  };

  /**
   * Toggle bookmark state for a course.
   * Only works when a user is logged in.
   *
   * @param {string} courseId - e.g. 'c1'
   */
  const toggleBookmark = (courseId) => {
    if (!currentUser || !courseId) return;
    const saved = currentUser.savedCourses ?? [];
    const updatedSaved = saved.includes(courseId)
      ? saved.filter((id) => id !== courseId)
      : [...saved, courseId];
    const updated = { ...currentUser, savedCourses: updatedSaved };
    setCurrentUser(updated);
    localStorage.setItem("currentUser", JSON.stringify(updated));
  };

  /**
   * Check whether a course is bookmarked by the current user.
   *
   * @param {string} courseId
   * @returns {boolean}
   */
  const isBookmarked = (courseId) => {
    return (currentUser?.savedCourses ?? []).includes(courseId);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, updateUser, updateProgress, toggleBookmark, isBookmarked }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
