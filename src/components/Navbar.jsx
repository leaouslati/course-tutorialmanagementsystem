import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "../pages/AuthContext";

export default function Navbar({ darkMode, toggleTheme }) {
  const { currentUser, logout } = useAuth();
  const user = currentUser;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!user;
  const role = user?.role; // 'student' | 'instructor'

  // Links
  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
  ];

  const studentLinks = [
    { name: "My Enrollments", path: "/enrollments" },
    { name: "Profile", path: "/profile" },
  ];

  const instructorLinks = [
    { name: "Management", path: "/management" },
    { name: "Profile", path: "/profile" },
  ];

  const navLinks = [
    ...publicLinks,
    ...(isLoggedIn ? (role === "instructor" ? instructorLinks : studentLinks) : []),
  ];

  // Side-effects 
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Link class helpers 
  const desktopLink = ({ isActive }) =>
    [
      "text-[15px] font-medium transition-colors duration-200 relative py-1",
      isActive
        ? "text-[#1976D2] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-[#1976D2] after:rounded-full"
        : "text-gray-600 dark:text-gray-300 hover:text-[#1976D2] dark:hover:text-[#90CAF9]",
    ].join(" ");

  const mobileLink = ({ isActive }) =>
    [
      "block rounded-xl px-4 py-3 text-[15px] font-medium transition-colors duration-150",
      isActive
        ? "bg-blue-50 text-[#1976D2] dark:bg-blue-950 dark:text-[#90CAF9]"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800",
    ].join(" ");

  // Render 
  return (
    <nav
      ref={menuRef}
      className={`sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      {/*
        Layout: Logo | Links (center-ish) | Actions
        pl-4 keeps logo close to the left edge — no max-w centering container
      */}
      <div className="relative flex items-center pl-4 pr-4 sm:pl-6 sm:pr-6 h-16 w-full">

        {/* ── Logo — flush left ── */}
        <NavLink to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1976D2] text-white text-sm font-bold shadow-sm group-hover:bg-[#1565C0] transition-colors duration-200 select-none">
            CH
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-[#1976D2] transition-colors duration-200">
            CourseHub
          </span>
        </NavLink>

        {/* ── Desktop Nav Links ── */}
        <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.path} className={desktopLink}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* ── Desktop Actions ── */}
        <div className="hidden md:flex items-center gap-3 ml-auto flex-shrink-0">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            style={{ color: "#1976D2" }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
          </button>

          {isLoggedIn ? (
            <>
              {/* User chip */}
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5">
                <div className="h-6 w-6 rounded-full bg-[#1976D2] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() ?? (role === "instructor" ? "I" : "S")}
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 max-w-[100px] truncate">
                  {user?.name ?? "Account"}
                </span>
              </div>

              {/* Logout — same height as chip */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition shadow-sm"
                style={{ backgroundColor: "#1976D2" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2196F3"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1976D2"}
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {/* Login — outlined, same size as Sign Up */}
              <button
                onClick={() => navigate("/login")}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                style={{ backgroundColor: "transparent", border: "1.5px solid #1976D2", color: "#1976D2" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e3f0fb"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Login
              </button>

              {/* Sign Up → /register */}
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition shadow-sm"
                style={{ backgroundColor: "#1976D2" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2196F3"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1976D2"}
              >
                <UserPlus size={15} />
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile: theme + hamburger ── */}
        <div className="flex items-center gap-2 md:hidden ml-auto">
          <button
            onClick={toggleTheme}
            className="h-9 w-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode
              ? <Sun size={17} strokeWidth={2} color="#1976D2" />
              : <Moon size={17} strokeWidth={2} color="#1976D2" />}
          </button>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="h-9 w-9 flex flex-col items-center justify-center gap-[5px] rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <span style={{ color: "#1976D2", fontSize: "16px", lineHeight: 1 }}>✕</span>
            ) : (
              <>
                <span style={{ display: "block", width: "16px", height: "2px", backgroundColor: "#1976D2", borderRadius: "2px" }} />
                <span style={{ display: "block", width: "16px", height: "2px", backgroundColor: "#1976D2", borderRadius: "2px" }} />
                <span style={{ display: "block", width: "16px", height: "2px", backgroundColor: "#1976D2", borderRadius: "2px" }} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 flex flex-col gap-1">

          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.path} className={mobileLink}>
              {link.name}
            </NavLink>
          ))}

          <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

          {isLoggedIn ? (
            <div className="flex items-center justify-between px-1 py-1">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-[#1976D2] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {user?.name?.[0]?.toUpperCase() ?? (role === "instructor" ? "I" : "S")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                    {user?.name ?? "Account"}
                  </p>
                  <p className={`text-xs font-medium capitalize ${
                    role === "instructor"
                      ? "text-purple-500 dark:text-purple-400"
                      : "text-blue-500 dark:text-blue-400"
                  }`}>
                    {role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-red-300 hover:text-red-500 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors duration-200"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              {/* Login mobile */}
              <button
                onClick={() => { navigate("/login"); setMenuOpen(false); }}
                className="w-full text-center rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                style={{ backgroundColor: "transparent", border: "1.5px solid #1976D2", color: "#1976D2" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e3f0fb"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Login
              </button>

              {/* Sign Up mobile → /register */}
              <button
                onClick={() => { navigate("/register"); setMenuOpen(false); }}
                className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
                style={{ backgroundColor: "#1976D2" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2196F3"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1976D2"}
              >
                <UserPlus size={15} />
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}