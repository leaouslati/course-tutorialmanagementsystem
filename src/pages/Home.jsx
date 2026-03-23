import React, { useState, useEffect, useRef } from "react";
import { BookOpen, TrendingUp, Users, Award, Code2, Star, Zap, Globe, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar";
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

const sectionHeader = (id, title, subtitle) => (
  <header className="text-center mb-8 sm:mb-10 md:mb-14">
    <h2 id={id} className="font-extrabold text-gray-900 tracking-tight mb-2 sm:mb-3"
      style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-500 max-w-xl mx-auto" style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)' }}>
        {subtitle}
      </p>
    )}
  </header>
);

function FeatureCard({ feature }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped(f => !f);

  return (
    <li style={{ perspective: '1000px', height: 'clamp(200px, 25vw, 256px)' }} className="list-none">
      <div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.7s ease', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        onClick={toggle}
        onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setFlipped(true); }}
        onMouseLeave={() => { if (window.matchMedia('(hover: hover)').matches) setFlipped(false); }}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
        tabIndex={0} role="button" aria-pressed={flipped}
        aria-label={`${feature.title} — press to ${flipped ? 'see overview' : 'see details'}`}
      >
        <div className="absolute w-full h-full bg-white shadow-md rounded-lg p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center text-center"
          style={{ backfaceVisibility: 'hidden' }}>
          <div style={{ width: 'clamp(1.8rem, 4vw, 3rem)', height: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '0.75rem' }}
            className="flex items-center justify-center mx-auto [&_svg]:!w-full [&_svg]:!h-full">
            {feature.icon}
          </div>
          <h3 className="font-semibold text-gray-900 mb-2" style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)' }}>{feature.title}</h3>
          <p className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)' }}>{feature.frontDesc}</p>
          <span className="mt-3 text-[10px] text-slate-300 sm:hidden select-none">tap to flip</span>
        </div>
        <div className="absolute w-full h-full bg-white shadow-md rounded-lg p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <ul className="space-y-2 text-left w-full">
            {feature.backDesc.split("|").map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#1976D2] flex-shrink-0 mt-0.5" aria-hidden="true">✔</span>
                <span className="text-gray-700 font-medium" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1rem)' }}>{item.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export default function Home() {
  const features = [
    { icon: <BookOpen className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />, title: "Expert-Led Courses",   frontDesc: "Learn from industry professionals with years of real-world experience.",              backDesc: "Live sessions with experts | Hands-on projects | Real-world case studies" },
    { icon: <TrendingUp className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />, title: "Track Progress",     frontDesc: "Monitor your learning journey with detailed progress tracking and achievements.",    backDesc: "Visual dashboards | Progress reminders | Goal setting tools"             },
    { icon: <Users className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,     title: "Community Support",  frontDesc: "Connect with other learners, ask questions, and share knowledge.",                  backDesc: "Discussion boards | Peer reviews | Group challenges"                     },
    { icon: <Award className="w-12 h-12 text-[#1976D2] mb-4 mx-auto" />,     title: "Certifications",     frontDesc: "Earn recognized certificates upon course completion for your portfolio.",           backDesc: "Verified certificates | Portfolio showcase | Employer recognition"       },
  ];

  const [topCourses] = useState(() => [...courses].sort((a, b) => b.rating - a.rating).slice(0, 4));
  const courseCount   = courses.length;
  const totalStudents = courses.reduce((s, c) => s + (c.studentsCount || 0), 0);
  const avgRating     = (courses.reduce((s, c) => s + (c.rating || 0), 0) / courseCount).toFixed(2);

  const statsRef    = useRef(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStartCount(true); observer.disconnect(); } }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => { if (statsRef.current) observer.unobserve(statsRef.current); };
  }, []);

  const stats = [
    { label: "Courses Available", value: courseCount - 1, color: "text-[#1976D2]",  suffix: "+", decimals: 0 },
    { label: "Active Learners",   value: totalStudents,   color: "text-[#22C55E]",  suffix: "",  decimals: 0 },
    { label: "Average Rating",    value: parseFloat(avgRating), color: "text-yellow-500", suffix: "", decimals: 2 },
  ];

  const formatStat = (stat) => {
    const { value, decimals, suffix, label } = stat;
    if (value >= 1000 && label !== 'Average Rating') return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return decimals > 0 ? value.toFixed(decimals) + suffix : value + suffix;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-gray-900">

        {/* 1. Hero */}
        <section aria-labelledby="hero-heading"
          className="bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2] text-white relative overflow-hidden"
          style={{ padding: 'clamp(4rem, 10vw, 9rem) 1rem' }}
        >
          {FLOAT_ICONS.map(({ Icon, size, duration, delay, ...pos }, i) => (
            <div key={i} aria-hidden="true" className="float-icon" style={{ ...pos, animationDuration: duration, animationDelay: delay }}>
              <Icon size={size} />
            </div>
          ))}
          <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-6">
            <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
              <h1 id="hero-heading" className="font-extrabold leading-tight tracking-tight drop-shadow-lg"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}>
                Learn <span className="text-[#64B5F6]">Anything,</span> Anytime
              </h1>
              <p className="text-blue-100 leading-relaxed max-w-2xl" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}>
                Learn from industry experts, grow your skills, and advance your career at your own pace.
              </p>
              <nav aria-label="Primary actions" className="flex flex-row flex-wrap gap-4 justify-center">
                {[{ to: "/courses", label: "Explore Courses", aria: "Explore our courses" }, { to: "/register", label: "Sign Up", aria: "Sign up for free" }].map(({ to, label, aria }) => (
                  <Link key={to} to={to}>
                    <button className="px-6 py-3 rounded-xl bg-[#90CAF9] text-[#1976D2] font-bold shadow-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1565C0]"
                      style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.125rem)' }} aria-label={aria}>
                      {label}
                    </button>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </section>

        {/* 2. Categories */}
        <section aria-labelledby="categories-heading" className="bg-white py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {sectionHeader("categories-heading", "Popular Categories", "Browse courses by category and find what interests you")}
            <nav aria-label="Course categories">
              <ul className="grid grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 items-stretch">
                {CATEGORIES.map((cat) => {
                  const count = courses.filter(c => c.category === cat.name).length;
                  return (
                    <li key={cat.id} className="w-full h-full">
                      <Link to={`/courses?category=${cat.name}`}
                        aria-label={`${cat.name} — ${count} ${count === 1 ? 'course' : 'courses'}`}
                        className="group block h-full rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-95 active:border-[#1976D2] transition-all duration-200 p-3 sm:p-5 md:p-6 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2]"
                      >
                        <span role="img" aria-hidden="true" className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 block">{cat.icon}</span>
                        <h3 className="font-bold text-gray-900 text-xs sm:text-sm md:text-base lg:text-lg leading-tight mb-1">{cat.name}</h3>
                        <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 font-medium">{count} {count === 1 ? 'course' : 'courses'}</p>
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
        <section aria-labelledby="featured-heading" className="bg-[#F4F8FD] py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {sectionHeader("featured-heading", "Featured Courses", "Check out our top-rated courses and start learning today")}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12"
              role="list" aria-label="Featured courses list">
              {topCourses.map((course) => (
                <div key={course.id} role="listitem"><CourseCard course={course} /></div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/courses">
                <button className="w-full sm:w-auto py-2.5 px-8 rounded-lg text-white font-semibold shadow transition-colors duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1976D2] focus-visible:ring-offset-2"
                  style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', backgroundColor: "#1976D2" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2196F3"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#1976D2"}
                  aria-label="View all available courses">
                  View All Courses
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Stats */}
        <section ref={statsRef} aria-labelledby="stats-heading" className="bg-white py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {sectionHeader("stats-heading", "Our Numbers Speak", null)}
            <dl className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <dt className={`font-extrabold tracking-tight ${stat.color}`} style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>
                    {startCount
                      ? stat.value >= 1000 && stat.label !== 'Average Rating'
                        ? formatStat(stat)
                        : <CountUp end={stat.value} duration={1.2} decimals={stat.decimals} suffix={stat.suffix} />
                      : formatStat(stat)}
                  </dt>
                  <dd className="text-gray-500 font-medium mt-1" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 1rem)' }}>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 5. Why Learn With Us */}
        <section aria-labelledby="features-heading" className="bg-[#F4F8FD] py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {sectionHeader("features-heading", "Why Learn With Us?", "Everything you need to succeed in your learning journey")}
            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-8 p-0">
              {features.map((feature, i) => <FeatureCard key={i} feature={feature} />)}
            </ul>
          </div>
        </section>

        {/* 6. CTA */}
        <section aria-labelledby="cta-heading"
          className="bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#1976D2] text-white relative overflow-hidden py-14 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-5 sm:gap-6">
            <h2 id="cta-heading" className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>
              Ready to Start Learning?
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto" style={{ fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)' }}>
              Join thousands of students already learning and advancing their careers with CourseHub.
            </p>
            <nav aria-label="Call to action" className="flex flex-row flex-wrap gap-4 justify-center pt-1">
              <Link to="/register">
                <button className="px-6 py-3 rounded-xl bg-[#90CAF9] text-[#1976D2] font-bold shadow-lg transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1565C0]"
                  style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1rem)' }} aria-label="Create a free account">
                  Create Free Account
                </button>
              </Link>
            </nav>
          </div>
        </section>

      </main>
    </>
  );
}