import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, UserPlus, LogOut, BookOpen } from "lucide-react";
import { authFetch } from "../api";
import Button from "./Button";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function Navbar({ darkMode = false, toggleTheme = () => {} }) {
  const [name, setName] = useState(() => localStorage.getItem("user_name") ?? null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Read token at render time — Navbar re-renders on every route change (via
  // useLocation), so token and decoded stay fresh after login/logout without
  // needing an API call for role.
  const token = localStorage.getItem("token");
  const decoded = token ? decodeToken(token) : null;
  const isLoggedIn = !!decoded;
  const role = decoded?.role;

  // Fetch name from /api/users/me once per token value.
  // Re-runs whenever the token string changes (login → new token, logout → null).
  useEffect(() => {
    if (!token) {
      setName(null);
      return;
    }
    let ignore = false;
    authFetch("/api/users/me")
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("token");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && !ignore) {
          setName(data.name);
          localStorage.setItem("user_name", data.name);
        }
      })
      .catch(() => {
        if (!ignore) setName(null);
      });
    return () => {
      ignore = true;
    };
  }, [token]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    ...(isLoggedIn
      ? role === "instructor"
        ? [
            { name: "Manage Courses", path: "/manage-courses" },
            { name: "Profile", path: "/profile" },
          ]
        : [
            { name: "My Enrollments", path: "/enrollments" },
            { name: "Profile", path: "/profile" },
          ]
      : []),
  ];

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    setName(null);
    navigate("/");
  };

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
          className={`flex items-center gap-2 font-bold text-xl no-underline shrink-0 whitespace-nowrap ${darkMode ? "text-white" : "text-[#1976D2]"}`}
          style={{ position: "relative" }}
        >
          <BookOpen size={22} strokeWidth={2.5} color={darkMode ? "#fff" : "#1976D2"} />
          <span className={darkMode ? "text-white" : "text-[#1976D2]"}>CourseHub</span>
        </NavLink>

        {/* Desktop nav links */}
        <ul role="list" className="hidden md:flex items-center justify-center gap-8 m-0 p-0 list-none min-w-0">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                aria-current={location.pathname === link.path ? "page" : undefined}
                className={`group text-base font-medium no-underline whitespace-nowrap transition-all duration-200 ${darkMode ? "text-white" : "text-[#1976D2]"}`}
                style={({ isActive }) => ({
                  color: darkMode ? "#fff" : "#1976D2",
                  paddingBottom: "3px",
                  borderBottom: isActive
                    ? `2.5px solid ${darkMode ? "#fff" : "#1976D2"}`
                    : "2.5px solid transparent",
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
              ? <Sun size={17} strokeWidth={2} color="#fff" />
              : <Moon size={17} strokeWidth={2} color="#1976D2" />}
          </button>

          {isLoggedIn ? (
            <>
              {/* User chip */}
              <div
                role="status"
                aria-label={`Logged in as ${name ?? "Account"}, ${role}`}
                className="flex items-center gap-2 h-9 px-3 rounded-[10px] shrink-0"
                style={{
                  border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                  backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
                }}
              >
                <div className="w-[22px] h-[22px] rounded-full bg-[#1976D2] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  {name?.[0]?.toUpperCase() ?? (role === "instructor" ? "I" : "S")}
                </div>
                <span className={`text-sm font-semibold max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                  {name ?? "Account"}
                </span>
              </div>

              {/* Logout */}
              <Button
                variant="primary"
                size="md"
                darkMode={darkMode}
                onClick={handleLogout}
                aria-label="Log out"
                icon={<LogOut size={15} />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Login */}
              <Button
                variant="outline"
                size="md"
                darkMode={darkMode}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>

              {/* Sign Up — only shown when not logged in */}
              <Button
                variant="primary"
                size="md"
                darkMode={darkMode}
                onClick={() => navigate("/register")}
                icon={<UserPlus size={15} />}
              >
                Sign Up
              </Button>
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
              ? <Sun size={17} strokeWidth={2} color="#fff" />
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
              <span style={{ color: darkMode ? "#ffffff" : "#1976D2", fontSize: "18px", lineHeight: 1, fontWeight: 400 }}>✕</span>
            ) : (
              <div className="flex flex-col gap-[5px] items-center">
                <span className={`block w-4 h-0.5 rounded-sm ${darkMode ? "bg-white" : "bg-[#1976D2]"}`} />
                <span className={`block w-4 h-0.5 rounded-sm ${darkMode ? "bg-white" : "bg-[#1976D2]"}`} />
                <span className={`block w-4 h-0.5 rounded-sm ${darkMode ? "bg-white" : "bg-[#1976D2]"}`} />
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
                  className={`block rounded-[10px] px-4 py-[11px] text-base font-medium no-underline transition-colors duration-150 ${darkMode ? "text-white" : "text-[#1976D2]"}`}
                  style={({ isActive }) => ({
                    color: darkMode ? "#fff" : "#1976D2",
                    backgroundColor: isActive ? (darkMode ? "#1e3a5f" : "#eff6ff") : "transparent",
                    borderLeft: isActive
                      ? `3px solid ${darkMode ? "#fff" : "#1976D2"}`
                      : "3px solid transparent",
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
                  {name?.[0]?.toUpperCase() ?? (role === "instructor" ? "I" : "S")}
                </div>
                <div>
                  <p className={`m-0 text-sm font-semibold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
                    {name ?? "Account"}
                  </p>
                  <p className="m-0 text-xs font-medium capitalize" style={{ color: role === "instructor" ? "#9333ea" : "#3b82f6" }}>
                    {role}
                  </p>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                darkMode={darkMode}
                onClick={handleLogout}
                icon={<LogOut size={15} />}
                fullWidth
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="lg"
                darkMode={darkMode}
                onClick={() => { navigate("/login"); setMenuOpen(false); }}
                fullWidth
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="lg"
                darkMode={darkMode}
                onClick={() => { navigate("/register"); setMenuOpen(false); }}
                icon={<UserPlus size={15} />}
                fullWidth
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
