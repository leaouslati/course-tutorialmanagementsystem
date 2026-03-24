import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#1976D2] text-white py-6 mt-auto">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} Travel Agency Management System. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/about" className="text-sm hover:text-blue-200 transition">About</Link>
          <Link to="/contact" className="text-sm hover:text-blue-200 transition">Contact</Link>
          <Link to="/privacy" className="text-sm hover:text-blue-200 transition">Privacy</Link>
        </div>

        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook className="w-5 h-5 hover:text-blue-200 transition" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="w-5 h-5 hover:text-blue-200 transition" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="w-5 h-5 hover:text-blue-200 transition" />
          </a>
        </div>

      </div>
    </footer>
  );
}