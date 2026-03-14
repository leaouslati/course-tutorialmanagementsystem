import React, { useState, useEffect, useRef } from "react";
import { BookOpen, TrendingUp, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar";
import { courses } from "../data/mockdata.js";
import CountUp from "react-countup";

const categories = [
  { id: 1, icon: "💻", name: "Programming" },
  { id: 2, icon: "🌐", name: "Web Development" },
  { id: 3, icon: "🎨", name: "Design" },
  { id: 4, icon: "📚", name: "Mathematics" },
  { id: 5, icon: "🗣️", name: "Language" },
];

export default function Home() {
  const features = [
    {
      icon: <BookOpen className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,
      title: "Expert-Led Courses",
      frontDesc: "Learn from industry professionals with years of real-world experience.",
      backDesc: "Live sessions with experts | Hands-on projects | Personalized feedback | Real-world case studies"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,
      title: "Track Progress",
      frontDesc: "Monitor your learning journey with detailed progress tracking and achievements.",
      backDesc: "Visual dashboards | Achievement badges | Progress reminders | Goal setting tools"
    },
    {
      icon: <Users className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,
      title: "Community Support",
      frontDesc: "Connect with other learners, ask questions, and share knowledge.",
      backDesc: "Discussion boards | Peer reviews | Group challenges | Mentor support"
    },
    {
      icon: <Award className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,
      title: "Certifications",
      frontDesc: "Earn recognized certificates upon course completion for your portfolio.",
      backDesc: "Verified certificates | Portfolio showcase | Resume boost | Employer recognition"
    }
  ];

  const [topCourses] = useState(() =>
    [...courses].sort((a, b) => b.rating - a.rating).slice(0, 4)
  );

  const courseCount = courses.length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const avgRating = (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courseCount).toFixed(2);

  const statsRef = useRef(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  const stats = [
    { label: "Courses Available", value: courseCount - 1, color: "text-[#1976D2]", suffix: "+", decimals: 0 },
    { label: "Active Learners", value: totalStudents, color: "text-[#22C55E]", suffix: "", decimals: 0 },
    { label: "Average Rating", value: parseFloat(avgRating), color: "text-yellow-500", suffix: "", decimals: 2 },
  ];
  return (
    <div className="min-h-screen font-inter">
      <Navbar />
    {/* 1. Hero Section */}
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
                <button className="px-4 py-2 rounded-lg bg-[#90CAF9] text-[#1976D2] font-semibold shadow transition-all hover:scale-105 w-full sm:w-auto">
                  Explore Courses
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 rounded-lg bg-[#90CAF9] text-[#1976D2] font-semibold shadow transition-all hover:scale-105 w-full sm:w-auto">
                  Sign Up Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse courses by category and find what interests you
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => {
              const courseCount = courses.filter(c => c.category === category.name).length;
              return (
                <Link key={category.id} to={`/courses?category=${category.name}`} className="group">
                  <div className="bg-white p-6 text-center shadow-md hover:shadow-xl transition-all flex flex-col items-center justify-center hover:scale-105">
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

      {/* 3. Featured Courses */}
      <section className="bg-[#F4F8FD] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Check out our top-rated courses and start learning today!
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {topCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/courses">
              <button
                className="w-full sm:w-auto py-2 px-6 rounded-lg text-white font-semibold text-center shadow transition-colors duration-300 hover:shadow-lg border-none focus:outline-none focus-visible:outline-none focus:ring-0"
                style={{ backgroundColor: "#1976D2" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0094c5")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}
              >
                View All Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Stats Section */}
      <section ref={statsRef} className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <p className={`text-4xl font-bold ${stat.color} mb-2`}>
                {startCount ? (
                  <CountUp
                    end={stat.value}
                    duration={1.2}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                  />
                ) : (
                  stat.decimals > 0 ? stat.value.toFixed(stat.decimals) : stat.value + stat.suffix
                )}
              </p>
              <p className="text-lg text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

     {/* 5. Why Learn With Us */}

<section className="py-20 px-4 bg-[#F4F8FD]">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Learn With Us?</h2>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
      Everything you need to succeed in your learning journey
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, i) => (
        <div key={i} className="perspective">
          <div className="relative w-full h-64 transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180 shadow-md rounded-lg">

            {/* Front Side */}
            <div className="absolute w-full h-full backface-hidden bg-white p-8 text-center rounded-lg flex flex-col justify-center items-center">
              {feature.icon}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.frontDesc}</p>
            </div>

            {/* Back Side - simple, white, check marks, no title */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white p-8 rounded-lg flex flex-col justify-center items-center">
              <ul className="text-gray-700 text-base font-medium space-y-3">
                {feature.backDesc.split("|").map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="inline-block text-blue-500 text-xl">✔</span>
                    <span>{item.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* 6. CTA Section */}
      <section className="bg-[#1976D2] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students already learning and advancing their careers with CourseHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link to="/register">
              <button className="px-4 py-2 rounded-lg bg-[#90CAF9] text-[#1976D2] font-semibold shadow transition-all hover:scale-105 w-full sm:w-auto">
                Create Free Account
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}