import { Routes, Route } from "react-router-dom";
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
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content grows to fill available space */}
      <main className="flex-1">
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
      </main>
      <Footer />
    </div>
  );
}

export default App;