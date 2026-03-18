import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ darkMode = false, toggleTheme = () => {}, isLoggedIn = false }) {
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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-[#1976D2] transition hover:text-[#1565C0]"
        >
          <span className="hidden sm:inline">📚</span>
          <span>CourseHub</span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `font-medium transition duration-200 ${
                  isActive
                    ? "border-b-2 border-white text-white"
                    : "text-white/80 hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Auth + Theme */}
        <div className="hidden items-center gap-4 md:flex">
          
          {!isLoggedIn && (
            <NavLink
              to="/register"
              className="rounded-lg border-2 border-white/60 px-5 py-2 font-semibold text-white transition duration-200 hover:bg-white/20"
            >
              Register
            </NavLink>
          )}

          <NavLink
            to={isLoggedIn ? "/logout" : "/login"}
            className={({ isActive }) =>
              `rounded-lg px-5 py-2 font-semibold transition duration-200 ${
                isActive
                  ? "bg-white/25 text-white shadow-md"
                  : "border-2 border-white/60 text-white/90 hover:bg-white/20 hover:text-white"
              }`
            }
          >
            {isLoggedIn ? "Logout" : "Login"}
          </NavLink>

          <button
            onClick={toggleTheme}
            className="rounded-lg border border-white/50 bg-white/10 px-4 py-2 font-medium text-white transition duration-200 hover:bg-white/20"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Mobile Buttons */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-white/50 bg-white/10 px-3 py-2 text-white"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-white/50 bg-white/10 px-3 py-2 text-white"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
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

            {!isLoggedIn && (
              <NavLink
                to="/register"
                onClick={closeMenu}
                className="rounded-lg border px-4 py-2 text-center font-semibold text-gray-700 hover:bg-gray-200"
              >
                Register
              </NavLink>
            )}

            <NavLink
              to={isLoggedIn ? "/logout" : "/login"}
              onClick={closeMenu}
              className="rounded-lg border-2 border-[#1976D2] bg-[#1976D2] px-4 py-2 text-center font-semibold text-white hover:bg-[#1565C0]"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}