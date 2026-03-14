import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import ManageCourses from "./pages/ManageCourses.jsx";
// Optional future pages
// import CourseDetails from "./pages/CourseDetails.jsx";
// import Enrollments from "./pages/Enrollments.jsx";
// import Login from "./pages/Login.jsx";
// import Register from "./pages/Register.jsx";
// import Profile from "./pages/Profile.jsx";

import './index.css';

function App() {
  // Temporary admin check for testing
  // Set isAdmin to true to test ManageCourses page
  const isAdmin = true;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />

      {/* ManageCourses route */}
      <Route 
        path="/manage-courses" 
        element={
          isAdmin ? <ManageCourses /> : <h2>Access Denied: Admins Only</h2>
        } 
      />

      {/* Future routes */}
      {/* <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/enrollments" element={<Enrollments />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} /> */}
    </Routes>
  )
}

export default App;