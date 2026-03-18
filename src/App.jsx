import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import ManageCourses from "./pages/ManageCourses.jsx";
import Register from "./pages/Register.jsx";
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/manage-courses" element={<ManageCourses />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;