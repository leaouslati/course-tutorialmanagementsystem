import React, { useState, useEffect, useRef } from "react";
import { BookOpen, TrendingUp, Users, Award, Code2, Star, Zap, Globe, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { courses } from "../data/mockdata.js";
import CountUp from "react-countup";

const CATEGORIES = [
  { id: 1, icon: "💻", name: "Programming" },
  { id: 2, icon: "🌐", name: "Web Development" },
  { id: 3, icon: "🎨", name: "Design" },
  { id: 4, icon: "📚", name: "Mathematics" },
  { id: 5, icon: "🗣️", name: "Language" },
];

const FLOAT_ICONS = [
  { Icon: Zap,      left: "20%", top: "5%",     size: 38, duration: "9s",   delay: "0.6s"  },
  { Icon: Pencil,   left: "45%", top: "3%",     size: 34, duration: "5.5s", delay: "1.8s"  },
  { Icon: Globe,    left: "72%", top: "6%",     size: 40, duration: "8s",   delay: "0.4s"  },
  { Icon: Code2,    left: "20%", bottom: "4%",  size: 44, duration: "4.5s", delay: "0.4s"  },
  { Icon: Star,     left: "45%", bottom: "3%",  size: 38, duration: "10s",  delay: "1.2s"  },
  { Icon: BookOpen, left: "70%", bottom: "5%",  size: 42, duration: "6.5s", delay: "0.7s"  },
  { Icon: BookOpen, left: "1%",  bottom: "15%", size: 52, duration: "4s",   delay: "0s"    },
  { Icon: Star,     left: "7%",  bottom: "50%", size: 44, duration: "11s",  delay: "0.5s"  },
  { Icon: Zap,      left: "13%", bottom: "8%",  size: 40, duration: "6s",   delay: "1.5s"  },
  { Icon: Pencil,   left: "4%",  bottom: "72%", size: 36, duration: "14s",  delay: "0.8s"  },
  { Icon: Code2,    right: "1%", bottom: "15%", size: 56, duration: "5s",   delay: "0.3s"  },
  { Icon: Globe,    right: "7%", bottom: "50%", size: 48, duration: "12s",  delay: "1s"    },
  { Icon: BookOpen, right:"13%", bottom: "8%",  size: 54, duration: "7s",   delay: "0.2s"  },
  { Icon: Star,     right: "4%", bottom: "72%", size: 42, duration: "13s",  delay: "2s"    },
];

function SectionHeader({ id, title, subtitle, darkMode }) {
  return (
    <header className="text-center mb-8 sm:mb-10 md:mb-14">
      <h2
        id={id}
        className={`font-extrabold tracking-tight mb-2 sm:mb-3 ${darkMode ? "text-slate-100" : "text-gray-900"}`}
        style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-xl mx-auto ${darkMode ? "text-slate-400" : "text-gray-500"}`}
          style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)" }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}

function FeatureCard({ feature, darkMode }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);

  return (

    <li
      className="list-none w-full sm:h-[220px] md:h-[240px] lg:h-[256px]"
    >
      <div
        className="relative w-full h-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={toggle}
        onMouseEnter={() => { if (window.matchMedia("(hover: hover) and (min-width: 640px)").matches) setFlipped(true); }}
        onMouseLeave={() => { if (window.matchMedia("(hover: hover) and (min-width: 640px)").matches) setFlipped(false); }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
        tabIndex={0}
        role="button"
        aria-pressed={flipped}
        aria-label={`${feature.title} — press to ${flipped ? "see overview" : "see details"}`}
      >
        {/* ── Mobile:  */}
        <div className="sm:hidden w-full">
          <div
            className={`w-full rounded-lg p-3 border overflow-hidden transition-all duration-300 h-[210px] ${
              darkMode
                ? "bg-[#0f2347] border-[#1e3f7a] shadow-[0_0_0_1px_rgba(30,63,122,0.5)]"
                : "bg-white border-transparent shadow-md"
            }`}
          >
            {!flipped ? (
              <div className="flex flex-col items-center justify-center text-center gap-1.5 h-full overflow-hidden">
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center [&_svg]:!w-full [&_svg]:!h-full [&_svg]:mb-0">
                  {feature.icon}
                </div>
                <h3 className={`font-semibold text-xs leading-tight ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
                  {feature.title}
                </h3>
                <p className={`text-[11px] leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                  {feature.frontDesc}
                </p>
                <span className="text-[9px] text-slate-400 select-none flex-shrink-0">tap to flip</span>
              </div>
            ) : (
              <ul className="space-y-1.5 w-full h-full overflow-y-auto flex flex-col items-center justify-center">
                {feature.backDesc.split("|").map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 justify-center">
                    <span className="text-[#1976D2] flex-shrink-0 mt-0.5 text-xs" aria-hidden="true">✔</span>
                    <span className={`text-xs font-medium leading-snug ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                      {item.trim()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Desktop: */}
        <div
          className="hidden sm:block relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.7s ease",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className={`absolute w-full h-full rounded-lg p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center text-center border transition-all duration-300 ${
              darkMode
                ? "bg-[#0f2347] border-[#1e3f7a] shadow-[0_0_0_1px_rgba(30,63,122,0.5)]"
                : "bg-white border-transparent shadow-md"
            }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div
              className="flex items-center justify-center mx-auto mb-3 [&_svg]:!w-full [&_svg]:!h-full"
              style={{ width: "clamp(1.8rem, 4vw, 3rem)", height: "clamp(1.8rem, 4vw, 3rem)" }}
            >
              {feature.icon}
            </div>
            <h3
              className={`font-semibold mb-2 ${darkMode ? "text-slate-100" : "text-gray-900"}`}
              style={{ fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)" }}
            >
              {feature.title}
            </h3>
            <p
              className={darkMode ? "text-slate-400" : "text-gray-500"}
              style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.9rem)" }}
            >
              {feature.frontDesc}
            </p>
          </div>

          {/* Back */}
          <div
            className={`absolute w-full h-full rounded-lg p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center border transition-all duration-300 ${
              darkMode
                ? "bg-[#0f2347] border-[#1e3f7a] shadow-[0_0_0_1px_rgba(30,63,122,0.5)]"
                : "bg-white border-transparent shadow-md"
            }`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <ul className="space-y-2 text-left w-full">
              {feature.backDesc.split("|").map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#1976D2] flex-shrink-0 mt-0.5" aria-hidden="true">✔</span>
                  <span
                    className={`font-medium ${darkMode ? "text-slate-300" : "text-gray-700"}`}
                    style={{ fontSize: "clamp(0.8rem, 1.4vw, 1rem)" }}
                  >
                    {item.trim()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function Home({ darkMode = false }) {
  const features = [
    { icon: <BookOpen className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />, title: "Expert-Led Courses",  frontDesc: "Learn from industry professionals with years of real-world experience.",           backDesc: "Live sessions with experts | Hands-on projects | Real-world case studies" },
    { icon: <TrendingUp className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />, title: "Track Progress",    frontDesc: "Monitor your learning journey with detailed progress tracking and achievements.", backDesc: "Visual dashboards | Progress reminders | Goal setting tools"             },
    { icon: <Users className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,     title: "Community Support", frontDesc: "Connect with other learners, ask questions, and share knowledge.",                backDesc: "Discussion boards | Peer reviews | Group challenges"                     },
    { icon: <Award className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,     title: "Certifications",    frontDesc: "Earn recognized certificates upon course completion for your portfolio.",        backDesc: "Verified certificates | Portfolio showcase | Employer recognition"       },
  ];

  const [topCourses] = useState(() => [...courses].sort((a, b) => b.rating - a.rating).slice(0, 4));
  const courseCount   = courses.length;
  const totalStudents = courses.reduce((s, c) => s + (c.studentsCount || 0), 0);
  const avgRating     = (courses.reduce((s, c) => s + (c.rating || 0), 0) / courseCount).toFixed(2);

  const statsRef = useRef(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStartCount(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => { if (statsRef.current) observer.unobserve(statsRef.current); };
  }, []);

  const stats = [
    { label: "Courses Available", value: courseCount - 1,      color: "text-[#1976D2]",  suffix: "+", decimals: 0 },
    { label: "Active Learners",   value: totalStudents,         color: "text-[#22C55E]",  suffix: "",  decimals: 0 },
    { label: "Average Rating",    value: parseFloat(avgRating), color: "text-yellow-500", suffix: "",  decimals: 2 },
  ];

  const formatStat = (stat) => {
    const { value, decimals, suffix, label } = stat;
    if (value >= 1000 && label !== "Average Rating")
      return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return decimals > 0 ? value.toFixed(decimals) + suffix : value + suffix;
  };

  const heroBg = darkMode
    ? "linear-gradient(135deg, #020b18 0%, #041530 25%, #0a2550 50%, #0d3272 65%, #1048a0 85%, #1565C0 100%)"
    : "linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1976D2 100%)";

  return (
    <main className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-[#060f1e] text-slate-100" : "bg-white text-gray-900"}`}>

      {/* 1. Hero */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden text-white"
        style={{ padding: "clamp(4rem, 10vw, 9rem) 1rem", background: heroBg }}
      >
        {FLOAT_ICONS.map(({ Icon, size, duration, delay, ...pos }, i) => (
          <div key={i} aria-hidden="true" className="float-icon" style={{ ...pos, animationDuration: duration, animationDelay: delay }}>
            <Icon size={size} />
          </div>
        ))}
        <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-6">
          <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
            <h1
              id="hero-heading"
              className="font-extrabold leading-tight tracking-tight drop-shadow-lg"
              style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)" }}
            >
              Learn <span className="text-[#64B5F6]">Anything,</span> Anytime
            </h1>
            <p className="text-blue-100 leading-relaxed max-w-2xl" style={{ fontSize: "clamp(0.95rem, 2vw, 1.25rem)" }}>
              Learn from industry experts, grow your skills, and advance your career at your own pace.
            </p>
            <nav aria-label="Primary actions" className="flex flex-row flex-wrap gap-4 justify-center">
              {[
                { to: "/courses",  label: "Explore Courses", aria: "Explore our courses" },
                { to: "/register", label: "Sign Up",         aria: "Sign up for free"    },
              ].map(({ to, label, aria }) => (
                <Link key={to} to={to}>
                  <button
                    className="px-6 py-3 rounded-xl font-bold shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1565C0]"
                    style={{
                      fontSize: "clamp(0.95rem, 1.5vw, 1.125rem)",
                      backgroundColor: darkMode ? "#5b9bd5" : "#ffffff",
                       color: darkMode?"#ffffff":"#1976D2",
                    }}
                    aria-label={aria}
                  >
                    {label}
                  </button>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* 2. Categories */}
      <section
        aria-labelledby="categories-heading"
        className={`py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          darkMode ? "bg-[#060f1e]" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            id="categories-heading"
            title="Popular Categories"
            subtitle="Browse courses by category and find what interests you"
            darkMode={darkMode}
          />
          <nav aria-label="Course categories">
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 items-stretch">
              {CATEGORIES.map((cat) => {
                const count = courses.filter((c) => c.category === cat.name).length;
                return (
                  <li key={cat.id} className="w-full h-full">
                    <Link
                      to={`/courses?category=${cat.name}`}
                      aria-label={`${cat.name} — ${count} ${count === 1 ? "course" : "courses"}`}
                      className={`group block h-full rounded-2xl border transition-all duration-300 p-3 sm:p-5 md:p-6 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] active:scale-95 ${
                        darkMode
                          ? "bg-[#0f2347] border-[#1e3f7a] hover:-translate-y-1 hover:border-[#2d5fc4] hover:shadow-[0_0_24px_4px_rgba(25,118,210,0.35)]"
                          : "bg-white border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 active:border-[#1976D2]"
                      }`}
                    >
                      <span role="img" aria-hidden="true" className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 block">
                        {cat.icon}
                      </span>
                      <h3 className={`font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-tight mb-1 ${
                        darkMode ? "text-slate-100" : "text-gray-900"
                      }`}>
                        {cat.name}
                      </h3>
                      <p className={`text-[10px] sm:text-xs md:text-sm font-medium ${
                        darkMode ? "text-slate-400" : "text-slate-400"
                      }`}>
                        {count} {count === 1 ? "course" : "courses"}
                      </p>
                      <div className="mt-2 sm:mt-3 h-0.5 w-0 group-hover:w-full bg-[#1976D2] transition-all duration-300 rounded-full mx-auto" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      {/* 3. Featured Courses */}
      <section
        aria-labelledby="featured-heading"
        className={`py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          darkMode ? "bg-[#0a1628]" : "bg-[#F4F8FD]"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            id="featured-heading"
            title="Featured Courses"
            subtitle="Check out our top-rated courses and start learning today"
            darkMode={darkMode}
          />
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12"
            role="list"
            aria-label="Featured courses list"
          >
            {topCourses.map((course) => (
              <div key={course.id} role="listitem">
                <CourseCard course={course} darkMode={darkMode} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/courses">
              <button
                className="w-full sm:w-auto py-2.5 px-8 rounded-lg text-white font-semibold shadow transition-colors duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2"
                style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)", backgroundColor: "#1976D2" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? "#1565C0" : "#2196F3")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
                aria-label="View all available courses"
              >
                View All Courses
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Stats */}
      <section
        ref={statsRef}
        aria-labelledby="stats-heading"
        className={`py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          darkMode ? "bg-[#060f1e]" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader id="stats-heading" title="Our Numbers Speak" darkMode={darkMode} />
          <dl className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <dt className={`font-extrabold tracking-tight ${stat.color}`} style={{ fontSize: "clamp(1.5rem, 5vw, 3rem)" }}>
                  {startCount
                    ? stat.value >= 1000 && stat.label !== "Average Rating"
                      ? formatStat(stat)
                      : <CountUp end={stat.value} duration={1.2} decimals={stat.decimals} suffix={stat.suffix} />
                    : formatStat(stat)}
                </dt>
                <dd
                  className={`font-medium mt-1 ${darkMode ? "text-slate-400" : "text-gray-500"}`}
                  style={{ fontSize: "clamp(0.7rem, 1.5vw, 1rem)" }}
                >
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 5. Why Learn With Us */}
      <section
        aria-labelledby="features-heading"
        className={`py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          darkMode ? "bg-[#0a1628]" : "bg-[#F4F8FD]"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            id="features-heading"
            title="Why Learn With Us?"
            subtitle="Everything you need to succeed in your learning journey"
            darkMode={darkMode}
          />
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-8 p-0">
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} darkMode={darkMode} />
            ))}
          </ul>
        </div>
      </section>

      {/* 6. CTA */}
      <section
        aria-labelledby="cta-heading"
        className="relative overflow-hidden text-white py-14 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        style={{ background: heroBg }}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-5 sm:gap-6">
          <h2
            id="cta-heading"
            className="font-extrabold tracking-tight"
            style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)" }}
          >
            Ready to Start Learning?
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto" style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.1rem)" }}>
            Join thousands of students already learning and advancing their careers with CourseHub.
          </p>
          <nav aria-label="Call to action" className="flex flex-row flex-wrap gap-4 justify-center pt-1">
            <Link to="/register">
              <button
                className="px-6 py-3 rounded-xl font-bold shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1565C0]"
                style={{
                  fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                  backgroundColor: darkMode ? "#5b9bd5" : "#ffffff",
                  color: darkMode?"#ffffff":"#1976D2",
                }}
                aria-label="Create a free account"
              >
                Create Free Account
              </button>
            </Link>
          </nav>
        </div>
      </section>

    </main>
  );
}