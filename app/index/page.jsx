"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await API.get("/hotels");
      setHotels(res.data);
    } catch (err) {
      console.log("Hotel Fetch Error:", err);
    }
  };

  const getImageUrl = (hotel) => {
    if (!hotel.images || hotel.images.length === 0) return "/no-image.png";
    let path = hotel.images[0].replace(/\\/g, "/");
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path}`;
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name?.toLowerCase().includes(search.toLowerCase())
  );

  const goToBookings = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    router.push("/my-bookings");
  };

  return (
    <>
      <Header />

      {/* HERO SECTION */}

      <section className="relative min-h-[80vh] flex items-center justify-center text-white px-4">
        <img
          src="/hero.jpg"
          alt="Hotel"
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-20 text-center max-w-xl w-full"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Find Your Perfect Stay
          </h1>

          <p className="text-md md:text-lg mb-6">
            Luxury • Comfort • Best Prices
          </p>

          {/* SEARCH */}

          <div className="flex justify-center mb-6">
            <input
              type="text"
              placeholder="Search hotel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-6 py-3 rounded-full w-[90%] sm:w-80 bg-white text-black border-2 border-gray-300 outline-none shadow-xl"
            />
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={goToBookings}
              className="bg-green-600 px-6 py-3 rounded-full hover:bg-green-700 transition"
            >
              🛎️ My Bookings
            </button>

            <Link
              href="/hotels"
              className="bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700 transition"
            >
              Browse Hotels
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FEATURED HOTELS */}

      <section className="py-16 bg-gray-100 dark:bg-gray-900 transition-colors">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          Featured Hotels
        </h2>

        <div className="flex overflow-x-auto gap-6 px-6 md:px-10 scrollbar-hide">
          {filteredHotels.map((hotel, index) => (
            <motion.div
              key={hotel._id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="min-w-[280px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
              <img
                src={getImageUrl(hotel)}
                alt={hotel.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {hotel.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-300">
                  {hotel.location}
                </p>

                <p className="text-green-600 font-semibold mt-2">
                  ₹{hotel.pricePerNight} / night
                </p>

                <Link
                  href={`/hotel/${hotel._id}`}
                  className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Rooms
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}

      <section className="py-16 bg-white dark:bg-gray-950 text-center transition-colors">
        <h2 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 px-6 md:px-10">
          <div className="p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Best Price
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Guaranteed best deals and affordable stays.
            </p>
          </div>

          <div className="p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Secure Booking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              100% safe and secure payment process.
            </p>
          </div>

          <div className="p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              24/7 Support
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We are here to help anytime.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}