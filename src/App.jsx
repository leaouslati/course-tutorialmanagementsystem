import {Routes, Route} from "react-router-dom";   
//import CourseDetails from "./pages/CourseDetails.jsx";
import Courses from "./pages/Courses.jsx";
import Enrollments from "./pages/Enrollments.jsx";
 import Home from "./pages/Home.jsx";
// import Login from "./pages/Login.jsx";
// import Register from "./pages/Register.jsx";
// import Profile from "./pages/Profile.jsx";
// import ManageCourses from "./pages/ManageCourses.jsx";
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/courses" element={<Courses />} />
      <Route path="/enrollments" element={<Enrollments />} />
      {/* <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/manage-courses" element={<ManageCourses />} /> */}
    </Routes>
  )
}

export default App