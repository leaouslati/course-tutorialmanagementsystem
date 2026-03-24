import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, UserPlus, LogOut, BookOpen } from "lucide-react";
import { useAuth } from "../pages/AuthContext";

export default function Navbar({ darkMode = false, toggleTheme = () => {} }) {
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
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Colors based on darkMode
  const bg = darkMode ? "#111827" : "#ffffff";
  const border = darkMode ? "#1f2937" : "#e5e7eb";
  const textPrimary = darkMode ? "#f9fafb" : "#1f2937";
  const chipBg = darkMode ? "#1f2937" : "#f9fafb";
  const chipBorder = darkMode ? "#374151" : "#e5e7eb";
  const iconBg = darkMode ? "#1f2937" : "#ffffff";
  const iconBorder = darkMode ? "#374151" : "#e5e7eb";
  const mobileActiveBg = darkMode ? "#1e3a5f" : "#eff6ff";

  const btnBase = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    height: "36px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "'Inter', sans-serif",
    cursor: "pointer",
    lineHeight: "1",
    padding: "0 16px",
    transition: "background-color 0.2s ease",
    boxSizing: "border-box",
  };

  const btnPrimary = {
    ...btnBase,
    backgroundColor: "#1976D2",
    color: "#ffffff",
    border: "none",
  };

  const btnOutline = {
    ...btnBase,
    backgroundColor: "transparent",
    color: "#1976D2",
    border: "1.5px solid #1976D2",
  };

  const btnIcon = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: `1px solid ${iconBorder}`,
    backgroundColor: iconBg,
    cursor: "pointer",
    padding: "0",
    color: "#1976D2",
    flexShrink: 0,
    boxSizing: "border-box",
    transition: "background-color 0.2s ease",
  };

  const navLinkStyle = (isActive) => ({
    fontSize: "16px",
    fontWeight: "500",
    fontFamily: "'Inter', sans-serif",
    textDecoration: "none",
    whiteSpace: "nowrap",
    color: "#1976D2",
    paddingBottom: "3px",
    borderBottom: isActive ? "2.5px solid #1976D2" : "2.5px solid transparent",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  });

  return (
    <nav
      ref={menuRef}
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: bg,
        borderBottom: `1px solid ${border}`,
        boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
        transition: "box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Main bar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        height: "64px",
        maxWidth: "1280px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}>

        {/* Logo */}
        <NavLink
          to="/"
          aria-label="CourseHub home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "20px",
            fontWeight: "700",
            fontFamily: "'Inter', sans-serif",
            color: "#1976D2",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <BookOpen size={22} strokeWidth={2.5} color="#1976D2" />
          CourseHub
        </NavLink>

        {/* Desktop nav links — centered */}
        <ul
          className="hidden md:flex"
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                aria-current={location.pathname === link.path ? "page" : undefined}
                style={({ isActive }) => navLinkStyle(isActive)}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div
          className="hidden md:flex"
          style={{ alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "auto" }}
        >
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={btnIcon}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
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
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  height: "36px",
                  borderRadius: "10px",
                  border: `1px solid ${chipBorder}`,
                  backgroundColor: chipBg,
                  padding: "0 12px",
                  flexShrink: 0,
                  boxSizing: "border-box",
                }}
              >
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  backgroundColor: "#1976D2", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "white", fontSize: "11px",
                  fontWeight: "700", flexShrink: 0,
                }}>
                  {user?.name?.[0]?.toUpperCase() ?? (role === "instructor" ? "I" : "S")}
                </div>
                <span style={{
                  fontSize: "14px", fontWeight: "600", color: textPrimary,
                  maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {user?.name ?? "Account"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                style={btnPrimary}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1565C0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1976D2"}
                aria-label="Log out"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                style={btnOutline}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#1e3a5f" : "#e3f0fb"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                style={btnPrimary}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1565C0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1976D2"}
              >
                <UserPlus size={15} />
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile icons — far right */}
        <div
          className="flex md:hidden"
          style={{ alignItems: "center", gap: "8px", marginLeft: "auto" }}
        >
          <button
            onClick={toggleTheme}
            style={btnIcon}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode
              ? <Sun size={17} strokeWidth={2} color="#1976D2" />
              : <Moon size={17} strokeWidth={2} color="#1976D2" />}
          </button>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={btnIcon}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <span style={{ color: "#1976D2", fontSize: "18px", lineHeight: 1, fontWeight: 400 }}>✕</span>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}>
                <span style={{ display: "block", width: "16px", height: "2px", backgroundColor: "#1976D2", borderRadius: "2px" }} />
                <span style={{ display: "block", width: "16px", height: "2px", backgroundColor: "#1976D2", borderRadius: "2px" }} />
                <span style={{ display: "block", width: "16px", height: "2px", backgroundColor: "#1976D2", borderRadius: "2px" }} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        id="mobile-menu"
        className="md:hidden"
        aria-hidden={!menuOpen}
        style={{
          overflow: "hidden",
          maxHeight: menuOpen ? "520px" : "0",
          opacity: menuOpen ? 1 : 0,
          transition: "max-height 0.3s ease-in-out, opacity 0.25s ease-in-out",
        }}
      >
        <div style={{
          borderTop: `1px solid ${border}`,
          backgroundColor: bg,
          padding: "12px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          transition: "background-color 0.3s ease",
        }}>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  aria-current={location.pathname === link.path ? "page" : undefined}
                  style={({ isActive }) => ({
                    display: "block",
                    borderRadius: "10px",
                    padding: "11px 16px",
                    fontSize: "16px",
                    fontWeight: "500",
                    fontFamily: "'Inter', sans-serif",
                    textDecoration: "none",
                    color: "#1976D2",
                    backgroundColor: isActive ? mobileActiveBg : "transparent",
                    borderLeft: isActive ? "3px solid #1976D2" : "3px solid transparent",
                    transition: "background-color 0.15s ease",
                    boxSizing: "border-box",
                  })}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div style={{ margin: "10px 0", borderTop: `1px solid ${border}` }} />

          {isLoggedIn ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "2px 4px" }}>
                <div style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  backgroundColor: "#1976D2", display: "flex", alignItems: "center",
                  justifyContent: "center", color: "white", fontSize: "15px",
                  fontWeight: "700", flexShrink: 0,
                }}>
                  {user?.name?.[0]?.toUpperCase() ?? (role === "instructor" ? "I" : "S")}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: textPrimary, fontFamily: "'Inter', sans-serif" }}>
                    {user?.name ?? "Account"}
                  </p>
                  <p style={{
                    margin: 0, fontSize: "12px", fontWeight: "500",
                    color: role === "instructor" ? "#9333ea" : "#3b82f6",
                    textTransform: "capitalize", fontFamily: "'Inter', sans-serif",
                  }}>
                    {role}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{ ...btnPrimary, width: "100%", height: "42px", borderRadius: "10px", fontSize: "15px" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1565C0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#1976D2"}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => { navigate("/login"); setMenuOpen(false); }}
                style={{ ...btnOutline, width: "100%", height: "42px", borderRadius: "10px", fontSize: "15px" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? "#1e3a5f" : "#e3f0fb"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Login
              </button>
              <button
                onClick={() => { navigate("/register"); setMenuOpen(false); }}
                style={{ ...btnPrimary, width: "100%", height: "42px", borderRadius: "10px", fontSize: "15px" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1565C0"}
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