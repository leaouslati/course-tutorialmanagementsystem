import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, UserPlus, LogOut, BookOpen } from "lucide-react";
import { useAuth } from "../pages/AuthContext";

export default function Navbar({ darkMode = false, toggleTheme = () => { } }) {
  const { currentUser, logout } = useAuth();
  const user = currentUser;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!user;
  const role = user?.role;

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
  ];
  const studentLinks = [
    { name: "My Enrollments", path: "/enrollments" },
    { name: "Profile", path: "/profile" },
  ];
  const instructorLinks = [
    { name: "Manage Courses", path: "/manage-courses" },
    { name: "Profile", path: "/profile" },
  ];
  const navLinks = [
    ...publicLinks,
    ...(isLoggedIn ? (role === "instructor" ? instructorLinks : studentLinks) : []),
  ];

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
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

  const handleLogout = () => { logout(); navigate("/"); };

  const iconBtn = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
    cursor: "pointer",
    padding: 0,
    flexShrink: 0,
    transition: "background-color 0.2s ease",
  };

  return (
    <nav
      ref={menuRef}
      role="navigation"
      aria-label="Main navigation"
      className={[
        "sticky top-0 z-50 transition-all duration-300 border-b",
        darkMode ? "bg-[#0d1b2e] border-gray-800" : "bg-white border-gray-200",
        scrolled ? "shadow-[0_2px_8px_rgba(0,0,0,0.08)]" : "",
      ].join(" ")}
    >
      {/* ── Main bar ── */}
      <div className="flex md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center h-16 px-4 sm:px-6 w-full">

        {/* Logo */}
        <NavLink
          to="/"
          aria-label="CourseHub home"
          className="flex items-center gap-2 text-[#1976D2] font-bold text-xl no-underline shrink-0 whitespace-nowrap"
        >
          <BookOpen size={22} strokeWidth={2.5} color="#1976D2" />
          CourseHub
        </NavLink>

        {/* Desktop nav links */}
        <ul role="list" className="hidden md:flex items-center justify-center gap-8 m-0 p-0 list-none min-w-0">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                aria-current={location.pathname === link.path ? "page" : undefined}
                className="text-base font-medium no-underline whitespace-nowrap text-[#1976D2] transition-all duration-200"
                style={({ isActive }) => ({
                  paddingBottom: "3px",
                  borderBottom: isActive ? "2.5px solid #1976D2" : "2.5px solid transparent",
                })}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0 justify-end">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            style={iconBtn}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#374151" : "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1f2937" : "#ffffff")}
          >
            {darkMode
              ? <Sun size={17} strokeWidth={2} color="#1976D2" />
              : <Moon size={17} strokeWidth={2} color="#1976D2" />}
          </button>

          {isLoggedIn ? (
            <>
              {/* User chip */}
              <div
                role="status"
                aria-label={`Logged in as ${user?.name}, ${role}`}
                className="flex items-center gap-2 h-9 px-3 rounded-[10px] shrink-0"
                style={{
                  border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                  backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
                }}
              >
                <div className="w-[22px] h-[22px] rounded-full bg-[#1976D2] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  {user?.name?.[0]?.toUpperCase() ?? (role === "instructor" ? "I" : "S")}
                </div>
                <span className={`text-sm font-semibold max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                  {user?.name ?? "Account"}
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-[10px] text-sm font-semibold text-white cursor-pointer transition-colors duration-200"
                style={{ backgroundColor: "#1976D2", border: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1565C0")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center h-9 px-4 rounded-[10px] text-sm font-semibold text-[#1976D2] cursor-pointer transition-colors duration-200"
                style={{ border: "1.5px solid #1976D2", backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1e3a5f" : "#e3f0fb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Login
              </button>

              {/* Sign up */}
              <button
                onClick={() => navigate("/register")}
                className="flex items-center justify-center gap-1.5 h-9 px-4 rounded-[10px] text-sm font-semibold text-white cursor-pointer transition-colors duration-200"
                style={{ backgroundColor: "#1976D2", border: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
              >
                <UserPlus size={15} />
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile icons */}
        <div className="flex md:hidden items-center gap-2 ml-auto">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            style={iconBtn}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#374151" : "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1f2937" : "#ffffff")}
          >
            {darkMode
              ? <Sun size={17} strokeWidth={2} color="#1976D2" />
              : <Moon size={17} strokeWidth={2} color="#1976D2" />}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={iconBtn}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#374151" : "#f3f4f6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1f2937" : "#ffffff")}
          >
            {menuOpen ? (
              <span style={{ color: "#1976D2", fontSize: "18px", lineHeight: 1, fontWeight: 400 }}>✕</span>
            ) : (
              <div className="flex flex-col gap-[5px] items-center">
                <span className="block w-4 h-0.5 bg-[#1976D2] rounded-sm" />
                <span className="block w-4 h-0.5 bg-[#1976D2] rounded-sm" />
                <span className="block w-4 h-0.5 bg-[#1976D2] rounded-sm" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        id="mobile-menu"
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        aria-hidden={menuOpen ? "false" : "true"}
        {...(!menuOpen && { inert: "" })}
        style={{ maxHeight: menuOpen ? "600px" : "0", opacity: menuOpen ? 1 : 0 }}
      >
        <div className={`border-t px-4 pb-4 pt-3 flex flex-col gap-1 transition-colors duration-300 ${darkMode ? "bg-[#0d1b2e] border-gray-800" : "bg-white border-gray-200"}`}>

          <ul role="list" className="list-none m-0 p-0 flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  aria-current={location.pathname === link.path ? "page" : undefined}
                  className="block rounded-[10px] px-4 py-[11px] text-base font-medium no-underline text-[#1976D2] transition-colors duration-150"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? (darkMode ? "#1e3a5f" : "#eff6ff") : "transparent",
                    borderLeft: isActive ? "3px solid #1976D2" : "3px solid transparent",
                  })}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={`my-2.5 border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`} />

          {isLoggedIn ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 px-1 py-0.5">
                <div className="w-[38px] h-[38px] rounded-full bg-[#1976D2] flex items-center justify-center text-white text-[15px] font-bold shrink-0">
                  {user?.name?.[0]?.toUpperCase() ?? (role === "instructor" ? "I" : "S")}
                </div>
                <div>
                  <p className={`m-0 text-sm font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                    {user?.name ?? "Account"}
                  </p>
                  <p className="m-0 text-xs font-medium capitalize" style={{ color: role === "instructor" ? "#9333ea" : "#3b82f6" }}>
                    {role}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 w-full h-[42px] rounded-[10px] text-[15px] font-semibold text-white cursor-pointer transition-colors duration-200"
                style={{ backgroundColor: "#1976D2", border: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1565C0")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { navigate("/login"); setMenuOpen(false); }}
                className="flex items-center justify-center w-full h-[42px] rounded-[10px] text-[15px] font-semibold text-[#1976D2] cursor-pointer transition-colors duration-200"
                style={{ border: "1.5px solid #1976D2", backgroundColor: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1e3a5f" : "#e3f0fb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Login
              </button>
              <button
                onClick={() => { navigate("/register"); setMenuOpen(false); }}
                className="flex items-center justify-center gap-1.5 w-full h-[42px] rounded-[10px] text-[15px] font-semibold text-white cursor-pointer transition-colors duration-200"
                style={{ backgroundColor: "#1976D2", border: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
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