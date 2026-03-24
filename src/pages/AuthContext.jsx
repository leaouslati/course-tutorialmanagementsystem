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
   * No new fields — just updates currentUser.progress[courseId].
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

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}