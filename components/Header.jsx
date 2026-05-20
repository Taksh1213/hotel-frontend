"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [token, setToken] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const savedTheme = localStorage.getItem("theme");

    if (storedToken) {
      setToken(storedToken);
    }

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }

    setLoading(false);
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/");
  };

  if (loading) return null; // prevents flicker

  return (
    <header className="bg-white dark:bg-gray-900 border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          🏨 HotelManagement
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-gray-700 dark:text-gray-200 font-medium">

          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          <Link href="/about" className="hover:text-blue-600 transition">
            About
          </Link>

          <Link href="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>

          {token && (
            <Link
              href="/profile"
              className="hover:text-blue-600 transition"
            >
              Profile
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full transition"
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center text-xs transition-transform ${
                darkMode ? "translate-x-7" : ""
              }`}
            >
              {darkMode ? "🌙" : "☀️"}
            </div>
          </button>

          {/* Auth Button */}
          {token ? (
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}