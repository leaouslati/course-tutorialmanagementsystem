import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    alert("Logged in successfully!");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD] flex flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Welcome back</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="border border-gray-300 bg-white/80 px-4 py-3 rounded-lg focus:border-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#1976D2]/40"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="border border-gray-300 bg-white/80 px-4 py-3 rounded-lg focus:border-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#1976D2]/40"
            />

            <button
              type="submit"
              className="mt-2 rounded-lg bg-[#1976D2] px-5 py-3 text-white font-semibold shadow-sm transition hover:bg-[#0D47A1]"
            >
              Log in
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account? <a href="/register" className="font-medium text-[#1976D2] hover:text-[#0D47A1]">Sign up</a>
          </p>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#1976D2] text-white py-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} CourseHub. Learn anytime, anywhere.</p>
      </footer>
    </div>
  );
}
