import { Routes, Route } from "react-router-dom";
import Courses from "./pages/Courses.jsx";
import CourseDetail from "./pages/CourseDetails.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ManageCourses from "./pages/ManageCourses.jsx";
import Enrollments from "./pages/Enrollments.jsx";
import Profile from "./pages/Profile.jsx";
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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/manage-courses" element={<ManageCourses />} />
      {/* <Route path="/enrollments" element={<Enrollments />} /> */}
      {/* <Route path="/profile" element={<Profile />} /> */}
    </Routes>
  );
}

export default App;