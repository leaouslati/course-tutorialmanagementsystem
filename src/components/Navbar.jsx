import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ darkMode, toggleTheme, isLoggedIn = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Enrollments", path: "/enrollments" },
    { name: "Profile", path: "/profile" },
    { name: "Manage Courses", path: "/manage-courses" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-[#1976D2] transition hover:text-[#1565C0]"
        >
          <span className="hidden sm:inline">📚</span>
          <span>CourseHub</span>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `font-medium transition duration-200 ${
                  isActive
                    ? "border-b-2 border-[#1976D2] text-[#1976D2]"
                    : "text-gray-700 hover:text-[#1976D2]"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <NavLink
            to={isLoggedIn ? "/logout" : "/login"}
            className={({ isActive }) =>
              `rounded-lg px-5 py-2 font-semibold transition duration-200 ${
                isActive
                  ? "bg-[#1976D2] text-white shadow-md"
                  : "border-2 border-[#1976D2] text-[#1976D2] hover:bg-[#1976D2] hover:text-white"
              }`
            }
          >
            {isLoggedIn ? "Logout" : "Login"}
          </NavLink>

          <button
            onClick={toggleTheme}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition duration-200 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-gray-300 px-3 py-2 text-[#1976D2] transition duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-[#1976D2] px-3 py-2 text-[#1976D2] transition duration-200"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 font-medium transition duration-200 ${
                    isActive
                      ? "bg-[#90CAF9] text-[#1976D2]"
                      : "text-gray-700 hover:bg-[#90CAF9] hover:text-[#1976D2]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            <NavLink
              to={isLoggedIn ? "/logout" : "/login"}
              onClick={closeMenu}
              className="rounded-lg border-2 border-[#1976D2] bg-[#1976D2] px-4 py-2 text-center font-semibold text-white transition duration-200 hover:bg-[#1565C0]"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}