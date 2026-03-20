import React, { useState, useEffect, useRef } from "react";
import { BookOpen, TrendingUp, Users, Award, Code2, Star, Zap, Globe, Pencil } from "lucide-react";
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
      backDesc: "Live sessions with experts | Hands-on projects | Real-world case studies"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,
      title: "Track Progress",
      frontDesc: "Monitor your learning journey with detailed progress tracking and achievements.",
      backDesc: "Visual dashboards | Progress reminders | Goal setting tools"
    },
    {
      icon: <Users className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,
      title: "Community Support",
      frontDesc: "Connect with other learners, ask questions, and share knowledge.",
      backDesc: "Discussion boards | Peer reviews | Group challenges"
    },
    {
      icon: <Award className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,
      title: "Certifications",
      frontDesc: "Earn recognized certificates upon course completion for your portfolio.",
      backDesc: "Verified certificates | Portfolio showcase | Employer recognition"
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
    <main className="min-h-screen font-inter bg-white text-gray-900">
      <header>
        <Navbar />
      </header>
   {/* 1. Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2] text-white relative overflow-hidden"
        style={{ padding: 'clamp(4rem, 10vw, 9rem) 1rem' }}
      >
        {/* Top icons — aria-hidden so screen readers skip */}
        {[
          { Icon: Zap,    left: "20%", top: "5%",  size: 38, duration: "9s",   delay: "0.6s" },
          { Icon: Pencil, left: "45%", top: "3%",  size: 34, duration: "5.5s", delay: "1.8s" },
          { Icon: Globe,  left: "72%", top: "6%",  size: 40, duration: "8s",   delay: "0.4s" },
        ].map(({ Icon, left, top, size, duration, delay }, i) => (
          <div key={`t${i}`} aria-hidden="true" className="float-icon" style={{ left, top, animationDuration: duration, animationDelay: delay }}>
            <Icon size={size} />
          </div>
        ))}

        {/* Bottom icons */}
        {[
          { Icon: Code2,    left: "20%", bottom: "4%", size: 44, duration: "4.5s", delay: "0.4s" },
          { Icon: Star,     left: "45%", bottom: "3%", size: 38, duration: "10s",  delay: "1.2s" },
          { Icon: BookOpen, left: "70%", bottom: "5%", size: 42, duration: "6.5s", delay: "0.7s" },
        ].map(({ Icon, left, bottom, size, duration, delay }, i) => (
          <div key={`b${i}`} aria-hidden="true" className="float-icon" style={{ left, bottom, animationDuration: duration, animationDelay: delay }}>
            <Icon size={size} />
          </div>
        ))}

        {/* Left side icons */}
        {[
          { Icon: BookOpen, left: "1%",  bottom: "15%", size: 52, duration: "4s",  delay: "0s"   },
          { Icon: Star,     left: "7%",  bottom: "50%", size: 44, duration: "11s", delay: "0.5s" },
          { Icon: Zap,      left: "13%", bottom: "8%",  size: 40, duration: "6s",  delay: "1.5s" },
          { Icon: Pencil,   left: "4%",  bottom: "72%", size: 36, duration: "14s", delay: "0.8s" },
        ].map(({ Icon, left, bottom, size, duration, delay }, i) => (
          <div key={`l${i}`} aria-hidden="true" className="float-icon" style={{ left, bottom, animationDuration: duration, animationDelay: delay }}>
            <Icon size={size} />
          </div>
        ))}

        {/* Right side icons */}
        {[
          { Icon: Code2,    right: "1%",  bottom: "15%", size: 56, duration: "5s",  delay: "0.3s" },
          { Icon: Globe,    right: "7%",  bottom: "50%", size: 48, duration: "12s", delay: "1s"   },
          { Icon: BookOpen, right: "13%", bottom: "8%",  size: 54, duration: "7s",  delay: "0.2s" },
          { Icon: Star,     right: "4%",  bottom: "72%", size: 42, duration: "13s", delay: "2s"   },
        ].map(({ Icon, right, bottom, size, duration, delay }, i) => (
          <div key={`r${i}`} aria-hidden="true" className="float-icon" style={{ right, bottom, animationDuration: duration, animationDelay: delay }}>
            <Icon size={size} />
          </div>
        ))}

        {/* Main content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-2 sm:px-6">
          <div className="flex flex-col items-center text-center gap-6 sm:gap-8">

            <h1
              id="hero-heading"
              className="font-extrabold leading-tight tracking-tight drop-shadow-lg"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
            >
              Learn <span className="text-[#64B5F6]">Anything,</span> Anytime
            </h1>

            <p
              className="text-blue-100 leading-relaxed max-w-2xl"
              style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}
            >
              Learn from industry experts, grow your skills, and advance your career at your own pace.
            </p>

            <nav aria-label="Primary actions" className="flex flex-row flex-wrap gap-4 justify-center">
              <Link to="/courses">
                <button
                  className="px-6 py-3 rounded-xl bg-[#90CAF9] text-[#1976D2] font-bold shadow-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1565C0]"
                  style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.125rem)' }}
                  aria-label="Explore our courses"
                >
                  Explore Courses
                </button>
              </Link>
              <Link to="/register">
                <button
                  className="px-6 py-3 rounded-xl bg-[#90CAF9] text-[#1976D2] font-bold shadow-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1565C0]"
                  style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.125rem)' }}
                  aria-label="Sign up for free"
                >
                  Sign Up
                </button>
              </Link>
            </nav>

          </div>
        </div>

      </section>
      {/* 2. Popular Categories */}
      <section
        aria-labelledby="categories-heading"
        className="bg-white py-12 md:py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">

          <header className="text-center mb-10 md:mb-14">
            <h2
              id="categories-heading"
              className="font-extrabold text-gray-900 tracking-tight mb-3"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              Popular Categories
            </h2>
            <p
              className="text-gray-500 max-w-xl mx-auto"
              style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)' }}
            >
              Browse courses by category and find what interests you
            </p>
          </header>

          <nav aria-label="Course categories">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {categories.map((category, idx) => {
                const count = courses.filter(c => c.category === category.name).length;
                return (
                  <li key={category.id}>
                    <Link
                      to={`/courses?category=${category.name}`}
                      aria-label={`${category.name} — ${count} ${count === 1 ? 'course' : 'courses'}`}
                      className="group block rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-5 sm:p-6 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"
                    >
                      <span
                        role="img"
                        aria-hidden="true"
                        className="text-3xl sm:text-4xl mb-3 block"
                      >
                        {category.icon}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg leading-tight mb-1">
                        {category.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium">
                        {count} {count === 1 ? 'course' : 'courses'}
                      </p>
                      <div className="mt-3 h-0.5 w-0 group-hover:w-full bg-[#1976D2] transition-all duration-300 rounded-full mx-auto" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

        </div>
      </section>

      {/* 3. Featured Courses */}
      <section className="bg-[#F4F8FD] py-12 md:py-20 px-4" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12 fade-in">
            <h2 id="featured-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Featured Courses</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Check out our top-rated courses and start learning today!
            </p>
          </header>
          <section aria-label="Featured courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {topCourses.map((course, idx) => (
                <div className="fade-in" style={{ animationDelay: `${0.1 * idx}s` }}>
                  <CourseCard key={course.id} course={course} />
                </div>
              ))}
            </div>
          </section>
          <div className="text-center">
            <Link to="/courses">
              <button
                className="w-full sm:w-auto py-2 px-6 rounded-lg text-white font-semibold text-center shadow transition-colors duration-300 hover:shadow-lg border-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"
                style={{ backgroundColor: "#1976D2" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#0094c5")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1976D2")}
                aria-label="View All Courses"
              >
                View All Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Stats Section */}
      <section ref={statsRef} className="bg-white py-10 md:py-16 px-4" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12 fade-in">
            <h2 id="stats-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Our Numbers Speak</h2>
          </header>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center" aria-label="Site statistics">
            {stats.map((stat, idx) => {
              const formatValue = (value, decimals, suffix) => {
                if (typeof value === 'number' && value >= 1000 && stat.label !== 'Average Rating') {
                  const kVal = (value / 1000).toFixed(1).replace(/\.0$/, '');
                  return `${kVal}k`;
                }
                return decimals > 0 ? value.toFixed(decimals) + suffix : value + suffix;
              };
              return (
                <div key={idx} className="flex flex-col items-center fade-in p-0 sm:p-0 md:p-0 mx-auto w-full max-w-xs" style={{ animationDelay: `${0.1 * idx}s` }}>
                  <p className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${stat.color} mb-1 tracking-tight`}>
                    {startCount ? (
                      stat.value >= 1000 && stat.label !== 'Average Rating' ?
                        formatValue(stat.value, stat.decimals, stat.suffix)
                        : <CountUp
                            end={stat.value}
                            duration={1.2}
                            decimals={stat.decimals}
                            suffix={stat.suffix}
                          />
                    ) : (
                      stat.value >= 1000 && stat.label !== 'Average Rating' ?
                        formatValue(stat.value, stat.decimals, stat.suffix)
                        : stat.decimals > 0 ? stat.value.toFixed(stat.decimals) + stat.suffix : stat.value + stat.suffix
                    )}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </section>
        </div>
      </section>

     {/* 5. Why Learn With Us */}
      <section className="py-12 md:py-20 px-4 bg-[#F4F8FD]" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto text-center">
          <header className="mb-12">
            <h2 id="features-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Why Learn With Us?</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Everything you need to succeed in your learning journey
            </p>
          </header>
          <section aria-label="Site features">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="perspective fade-in" style={{ animationDelay: `${0.1 * i}s` }}>
                  <div className="relative w-full h-64 transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180 shadow-md rounded-lg" tabIndex={0} aria-label={feature.title}>
                    {/* Front Side */}
                    <div className="absolute w-full h-full backface-hidden bg-white p-8 text-center rounded-lg flex flex-col justify-center items-center">
                      {feature.icon}
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 text-sm md:text-base">{feature.frontDesc}</p>
                    </div>
                    {/* Back Side */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white p-8 rounded-lg flex flex-col justify-center items-center">
                      <ul className="text-gray-700 text-base font-medium space-y-3">
                        {feature.backDesc.split("|").map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="inline-block text-blue-500 text-xl" aria-label="check mark">✔</span>
                            <span>{item.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#1976D2] text-white py-16 md:py-24 px-4 relative overflow-hidden" aria-label="ready-to-learn">
  <div className="max-w-4xl mx-auto text-center fade-in">
    <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
      Ready to Start Learning?
    </h2>
    <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-4 max-w-2xl mx-auto">
      Join thousands of students already learning and advancing their careers with CourseHub.
    </p>
    <nav aria-label="CTA actions" className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
      <Link to="/register">
        <button className="px-4 py-2 rounded-lg bg-[#90CAF9] text-[#1976D2] font-semibold shadow transition-all hover:scale-105 w-full sm:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]" aria-label="Create Free Account">
          Create Free Account
        </button>
      </Link>
    </nav>
  </div>
</section>
    </main>
  );
}