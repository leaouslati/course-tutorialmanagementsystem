import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all fields.");
      return;
    }

    localStorage.setItem("user", JSON.stringify(formData));

    alert("Registered successfully!");
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D47A1] via-[#1565C0] to-[#1976D2] flex flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-[#1976D2]">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="border border-[#1976D2] bg-white text-gray-900 placeholder-gray-400 px-4 py-3 rounded-lg focus:border-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#1976D2]/40"
            />

            <input
              type="email" 
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border border-[#1976D2] bg-white text-gray-900 placeholder-gray-400 px-4 py-3 rounded-lg focus:border-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#1976D2]/40"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border border-[#1976D2] bg-white text-gray-900 placeholder-gray-400 px-4 py-3 rounded-lg focus:border-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#1976D2]/40"
            />

            <button
              type="submit"
              className="mt-2 px-5 py-3 rounded-lg text-white font-semibold text-center shadow transition-colors duration-300 hover:shadow-lg border-none focus:outline-none focus-visible:outline-none focus:ring-0"
              style={{ backgroundColor: "#1976D2" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#0094c5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#1976D2")
              }
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-[#1976D2] hover:text-[#1976D2]"
            >
              Log in
            </a>
          </p>
        </div>
      </main>

      <footer className="bg-blue-600 text-white py-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} CourseHub. Learn anytime, anywhere.</p>
      </footer>
    </div>
  );
};

export default Register;