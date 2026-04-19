import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import Courses from "./pages/Courses.jsx";
import Enrollments from "./pages/Enrollments.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import ManageCourses from "./pages/ManageCourses.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import PackageDetails from "./pages/PackageDetails.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
//import Footer from "./components/Footer.jsx";
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<Home darkMode={darkMode} />} />
        <Route path="/packages" element={<Browse darkMode={darkMode} />} />
        <Route path="/courses" element={<Courses darkMode={darkMode} />} />
        <Route path="/enrollments" element={<Enrollments darkMode={darkMode} />} />
        <Route path="/wishlist" element={<Wishlist darkMode={darkMode} />} />
        <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
        <Route path="/manage-courses" element={<ManageCourses darkMode={darkMode} />} />
        <Route path="/login" element={<Login darkMode={darkMode} />} />
        <Route path="/profile" element={<Profile darkMode={darkMode} />} />
        <Route path="/register" element={<Register darkMode={darkMode} />} />
        <Route path="/packages/:id" element={<PackageDetails darkMode={darkMode} />} />
        <Route path="/courses/:id" element={<CourseDetails darkMode={darkMode} />} />
        {/* Redirect /management → /manage-courses so the old URL doesn't show a blank page */}
        <Route path="/management" element={<Navigate to="/manage-courses" replace />} />
      </Routes>
    </div>
  );
}

export default App;