"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const router = useRouter();
  const { initializeAuth, token } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load initial theme state
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    const html = document.documentElement;
    if (nextDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, and PNG images are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be less than 2MB");
      return;
    }

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreview(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Form validations
    if (form.name.trim().length < 3) {
      return setError("Name must be at least 3 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return setError("Invalid email address format");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!passwordRegex.test(form.password)) {
      return setError("Password must contain at least one letter and one number");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("password", form.password);
      if (profileImage) {
        formData.append("image", profileImage);
      }

      const { data } = await API.post("/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Registration successful! Logging you in...");
      
      // Auto login user after register if token is returned
      if (data.token) {
        initializeAuth(data.token, data.user);
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Stagger Animation configurations
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500 p-4 py-12">
      
      {/* ─── DYNAMIC ANIMATED GRADIENT BACKGROUNDS ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-linear-to-br from-indigo-400/20 to-purple-500/20 blur-[120px] dark:from-indigo-900/10 dark:to-purple-800/10 animate-pulse" style={{ animationDuration: "9s" }} />
        <div className="absolute -bottom-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-linear-to-tr from-blue-400/20 to-pink-500/20 blur-[120px] dark:from-blue-900/10 dark:to-pink-800/10 animate-pulse" style={{ animationDuration: "11s", animationDelay: "1s" }} />
      </div>

      {/* ─── MAIN GLASSMORPHIC CARD ─── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800/40 bg-white/45 dark:bg-slate-900/45 p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300"
      >
        {/* Floating Dark Mode Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-lg shadow-sm hover:scale-105 active:scale-95 transition-all"
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Title Block */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 text-2xl mb-2">
            ✨
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
            Create Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sign up to book premium rooms and track payments
          </p>
        </motion.div>

        {/* Error Notification */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              className="mb-5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-2 overflow-hidden"
            >
              <span>❌</span>
              <span className="flex-1">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Block */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Animated Avatar Uploader */}
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Profile Photo (Optional)
            </span>
            <div className="relative group">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-indigo-500 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/50">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <span className="text-2xl">📸</span>
                    <span className="text-[10px] font-bold mt-1 uppercase tracking-wide">Upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Hover Overlay Clear Button */}
              {preview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white text-xs border border-white dark:border-slate-900 shadow-md hover:scale-105 active:scale-95 transition-all"
                  title="Remove image"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name input field */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  👤
                </span>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium text-sm shadow-inner"
                />
              </div>
            </motion.div>

            {/* Email input field */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  ✉️
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="doe@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium text-sm shadow-inner"
                />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password input field */}
            <motion.div variants={itemVariants} className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔒
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium text-sm shadow-inner"
                />
              </div>
            </motion.div>

            {/* Confirm Password input field */}
            <motion.div variants={itemVariants} className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Confirm Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔒
                </span>
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-medium text-sm shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-sm"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Submit button */}
          <motion.div variants={itemVariants} className="pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, translateY: -1 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full overflow-hidden bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-blue-500/10 active:shadow-inner transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <span>Sign Up</span>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Footer Navigation */}
        <motion.div variants={itemVariants} className="text-center mt-6 pt-5 border-t border-slate-200/50 dark:border-slate-800/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
