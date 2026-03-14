import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { courses } from "../data/mockdata.js";

function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    const featured = courses
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
    setFeaturedCourses(featured);
  }, []);

  const categories = [
    { name: "Programming", icon: "💻", count: 1 },
    { name: "Web Development", icon: "🌐", count: 2 },
    { name: "Data Science", icon: "📊", count: 1 },
    { name: "Mobile Development", icon: "📱", count: 1 },
    { name: "Design", icon: "🎨", count: 1 },
  ];

  return (
    <div className="bg-[#F4F8FD] text-gray-900">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-[#1976D2] text-white">
        <h1 className="text-5xl font-bold mb-4">Learn Anything, Anytime</h1>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Explore hundreds of courses designed to help you grow and succeed. Learn at your pace, anywhere.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 rounded-lg bg-white text-[#1976D2] font-semibold shadow hover:bg-gray-100 transition">
            Browse Courses
          </button>
          <button className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white hover:text-[#1976D2] transition">
            Login / Signup
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 flex flex-col sm:flex-row justify-around gap-10 text-center bg-[#F4F8FD]">
        <div className="opacity-0 animate-fade-in">
          <h2 className="text-4xl font-bold">6+</h2>
          <p className="text-gray-600 mt-2">Courses</p>
        </div>
        <div className="opacity-0 animate-fade-in delay-100">
          <h2 className="text-4xl font-bold">87K+</h2>
          <p className="text-gray-600 mt-2">Students</p>
        </div>
        <div className="opacity-0 animate-fade-in delay-200">
          <h2 className="text-4xl font-bold">4.8</h2>
          <p className="text-gray-600 mt-2">Avg Rating</p>
        </div>
        <div className="opacity-0 animate-fade-in delay-300">
          <h2 className="text-4xl font-bold">250%</h2>
          <p className="text-gray-600 mt-2">Growth</p>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 px-4">
        <h2 className="text-2xl font-semibold mb-6">Featured Courses</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
          {featuredCourses.map((course) => (
            <div key={course.id} className="opacity-0 transition duration-700 hover:translate-y-[-5px] hover:shadow-xl animate-fade-in">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
        <div className="text-center">
          <button className="px-6 py-3 rounded-lg bg-[#1976D2] text-white font-semibold shadow hover:bg-blue-700 transition">
            Explore All Courses
          </button>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 px-4 bg-white">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Popular Categories</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-[#F4F8FD] p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition flex flex-col items-center cursor-pointer"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="text-lg font-semibold">{cat.name}</h3>
              <p className="text-gray-600">{cat.count} courses</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Learn With Us Section */}
      <section className="py-16 px-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Why Learn With Us</h2>
        <div className="flex flex-col md:flex-row justify-around gap-6 items-center">
          <img src="/images/learn1.jpg" alt="Learning" className="rounded-xl shadow-lg w-full md:w-1/3 hover:translate-x-2 transition"/>
          <img src="/images/learn2.jpg" alt="Growth" className="rounded-xl shadow-lg w-full md:w-1/3 hover:-translate-x-2 transition"/>
          <img src="/images/learn3.jpg" alt="Skills" className="rounded-xl shadow-lg w-full md:w-1/3 hover:translate-x-1 transition"/>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-[#1976D2] text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Join thousands of students and gain skills that help you succeed.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 rounded-lg bg-white text-[#1976D2] font-semibold shadow hover:bg-gray-100 transition">
            Login
          </button>
          <button className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-white hover:text-[#1976D2] transition">
            Signup
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;