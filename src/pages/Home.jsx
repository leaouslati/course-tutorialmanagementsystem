import React, { useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar";
import { courses } from "../data/mockdata.js";

// Example categories (update as needed)
const categories = [
  { id: 1, icon: "💻", name: "Programming" },
  { id: 2, icon: "🌐", name: "Web Development" },
  { id: 3, icon: "📊", name: "Data Science" },
  { id: 4, icon: "📱", name: "Mobile Development" },
  { id: 5, icon: "🎨", name: "Design" },
];

export default function Home() {
  const [topCourses] = useState(() =>
    [...courses].sort((a, b) => b.rating - a.rating).slice(0, 4)
  );

  const stats = [
    { label: "Courses", value: "6+", color: "text-[#1976D2]" },
    { label: "Students", value: "87K+", color: "text-[#22C55E]" },
    { label: "Avg Rating", value: "4.8", color: "text-yellow-500" },
    { label: "Growth", value: "250%", color: "text-[#1976D2]" },
  ];

  return (
    <div className="min-h-screen font-inter">
      <Navbar />

      {/* Hero Section - Material Blue */}
      <section className="bg-[#1976D2] text-white py-32 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Learn <span className="text-[#90CAF9]">Anything,</span> Anytime
            </h1>
            <p className="text-lg text-blue-100 max-w-lg">
              Master new skills with our comprehensive courses. From programming to design, learn from industry experts and advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/courses">
                <button className="px-4 py-2 rounded-lg bg-[#90CAF9] text-[#1976D2] font-semibold shadow transition-colors w-full sm:w-auto">
                  Explore Courses
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 rounded-lg border border-[#1976D2] text-[#1976D2] font-semibold bg-white w-full sm:w-auto hover:bg-white hover:text-[#1976D2] hover:border-[#1976D2] transition-colors duration-300">
                  Sign Up Free
                </button>
              </Link>
            </div>
          </div>
          {/* Optional: Add an image or SVG here */}
        </div>
      </section>

      {/* Stats Section - White */}
      <section className="bg-white py-12 px-4 border-b">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses Section - Light Blue */}
      <section className="bg-[#90CAF9] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Discover our most popular and highly-rated courses curated for your learning journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {topCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/courses">
              <button className="px-4 py-2 rounded-lg bg-[#1976D2] text-white font-semibold shadow transition-colors w-full sm:w-auto hover:bg-[#1565C0] hover:text-white transition">
                View All Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Light background */}
      <section className="py-20 px-4 bg-[#F4F8FD]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse courses by category and find what interests you
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => {
              const courseCount = courses.filter(c => c.category === category.name).length;
              return (
                <Link
                  key={category.id}
                  to={`/courses?category=${category.name}`}
                  className="group"
                >
                  <div className="bg-white p-6 text-center hover:shadow-lg transition-all h-full flex flex-col items-center justify-center hover:scale-105">
                    <span className="text-4xl mb-3 block">{category.icon}</span>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{courseCount} courses</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - White */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Learn With Us?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Learn at Your Pace',
                description: 'Study whenever and wherever you want. Access all course materials anytime.',
                icon: '⏱️'
              },
              {
                title: 'Expert Instructors',
                description: 'Learn from industry professionals with years of real-world experience.',
                icon: '👨‍🏫'
              },
              {
                title: 'Certification',
                description: 'Earn recognized certificates upon course completion to boost your resume.',
                icon: '🏆'
              }
            ].map((benefit, idx) => (
              <div key={idx} className="bg-[#F4F8FD] p-8 shadow-md hover:shadow-lg transition-all text-center">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Material Blue */}
      <section className="bg-[#1976D2] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning and advancing their careers with LEA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="px-4 py-2 rounded-lg border border-[#1976D2] text-[#1976D2] font-semibold bg-white w-full sm:w-auto hover:bg-white hover:text-[#1976D2] hover:border-[#1976D2] transition-colors duration-300">
                Sign Up Free
              </button>
            </Link>
            <Link to="/courses">
              <button className="px-4 py-2 rounded-lg bg-[#1976D2] text-white font-semibold shadow transition-colors w-full sm:w-auto hover:bg-[#1565C0] hover:text-white transition">
                Browse Courses
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}