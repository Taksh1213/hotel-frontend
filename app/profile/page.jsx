"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { normalizeImageUrl } from "@/utils/image";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { updateAuthUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const { data } = await API.get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);
        setForm({ name: data.name, email: data.email, password: "" });
        setPreview(data.image ? normalizeImageUrl(data.image) : null);
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      if (form.password) formData.append("password", form.password);
      if (profileImage) formData.append("image", profileImage);

      const { data } = await API.put("/user/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(data);
      updateAuthUser(data);
      setPreview(data.image ? normalizeImageUrl(data.image) : preview);
      setMessage("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setMessage("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <>
        <Header />
        <div className="min-h-[40vh] flex items-center justify-center">
          <LoadingSpinner text="Loading profile..." />
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="max-w-3xl mx-auto p-4 sm:p-6">

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back
          </button>

          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            My Profile
          </h1>

          {message && (
            <p
              className={`text-center mb-4 ${
                message.includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <motion.form
            onSubmit={handleUpdate}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
          >

            {/* Profile Image */}
            <div className="flex flex-col items-center">
              {preview ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-2 border">
                  <Image
                    src={preview}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 mb-2 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-700 dark:text-gray-300"
              />
            </div>

            {/* Name */}
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="New Password (leave blank to keep current)"
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </motion.form>
        </div>
      </div>

      <Footer />
    </>
  );
}
