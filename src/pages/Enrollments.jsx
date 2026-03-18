import React from "react";
import Navbar from "../components/Navbar";

export default function Enrollments() {
  return (
    <div className="min-h-screen bg-[#F4F8FD]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Enrollments</h1>
        <p className="text-gray-600">
          You don’t have any enrollments yet. Browse courses to start learning.
        </p>
      </main>
    </div>
  );
}
