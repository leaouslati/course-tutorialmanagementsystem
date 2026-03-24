import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import Enrollments from "./pages/Enrollments.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import ManageCourses from "./pages/ManageCourses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import Footer from "./components/Footer.jsx";
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
  <>
    <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/enrollments" element={<Enrollments />} />
      <Route path="/manage-courses" element={<ManageCourses />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/register" element={<Register />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
    </Routes>
    <Footer />
  </>
);
}

export default App;