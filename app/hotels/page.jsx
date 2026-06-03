"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import API from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { normalizeImageUrl } from "@/utils/image";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const getImageUrl = (hotel) => {
    return normalizeImageUrl(hotel.images?.[0]) || "/no-image.png";
  };

  const fetchHotels = async () => {
    try {
      const res = await API.get("/hotels");
      setHotels(res.data);
      setLoading(false);
    } catch (err) {
      console.log("Hotel Fetch Error:", err);
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name?.toLowerCase().includes(search.toLowerCase()) ||
    hotel.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />

      {/* PAGE HEADER */}

      <main className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors">
      <section className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-12 sm:py-14 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Browse Hotels</h1>
        <p className="mt-2 text-lg text-indigo-100">
          Find the best hotels for your stay
        </p>
      </section>

      {/* SEARCH BAR */}

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <input
          type="text"
          placeholder="Search by hotel name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* HOTEL GRID */}

      <section className="py-12 px-4 md:px-6 max-w-7xl mx-auto">

        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Loading hotels..." />
          </div>
        ) : filteredHotels.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
            No hotels found
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

            {filteredHotels.map((hotel, index) => (
              <motion.div
                key={hotel._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              >

                <div className="relative h-52 w-full">
                  <Image
                    src={getImageUrl(hotel)}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-4">

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {hotel.name}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400">
                    {hotel.location}
                  </p>

                  <p className="text-emerald-600 font-semibold mt-2">
                    ₹{hotel.pricePerNight} / night
                  </p>

                  <Link
                    href={`/hotel/${hotel._id}`}
                    className="block mt-4 text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    View Rooms
                  </Link>

                </div>

              </motion.div>
            ))}

          </div>
        )}

      </section>
      </main>

      <Footer />
    </>
  );
}
