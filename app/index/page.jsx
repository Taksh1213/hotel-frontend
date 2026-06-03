"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import API from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { normalizeImageUrl } from "@/utils/image";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchHotels();
  }, []);

  const getImageUrl = (hotel) => {
    if (!hotel.images || hotel.images.length === 0) return "/no-image.png";
    return normalizeImageUrl(hotel.images[0]) || "/no-image.png";
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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/hero.jpg"
              alt="Luxury Hotel"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl w-full mx-auto mt-10"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-white/90 text-sm font-semibold tracking-wider mb-6 border border-white/30 uppercase">
            Experience Ultimate Luxury
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Find Your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-300">Perfect Stay</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
            Discover world-class accommodations, impeccable service, and unforgettable experiences tailored just for you.
          </p>

          {/* SEARCH BAR */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-10 w-full max-w-2xl mx-auto"
          >
            <div className="relative w-full group shadow-2xl">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <svg className="w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 md:py-5 rounded-full bg-white/95 backdrop-blur-sm text-gray-900 border-2 border-transparent focus:border-blue-500 outline-none transition-all text-lg font-medium shadow-inner"
              />
            </div>
          </motion.div>

          {/* ACTION BUTTONS */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <Link
              href="/hotels"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Browse Hotels</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            
            <button
              onClick={goToBookings}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <span>My Bookings</span>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURED HOTELS SECTION */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-12">
          <div>
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Top Rated</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
              Featured Hotels
            </h2>
          </div>
          <Link href="/hotels" className="hidden sm:flex text-blue-600 dark:text-blue-400 font-semibold hover:underline items-center gap-1">
            View All <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full py-12 text-center">
              <LoadingSpinner text="Loading hotels..." />
            </div>
          ) : filteredHotels.length > 0 ? (
            filteredHotels.slice(0, 8).map((hotel, index) => (
              <motion.div
                key={hotel._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full border border-gray-100 dark:border-gray-700"
              >
                  <div className="relative h-52 sm:h-60 overflow-hidden">
                    <Image
                      src={getImageUrl(hotel)}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority={index < 2}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    <span className="text-gray-900 dark:text-white">₹{hotel.pricePerNight}</span>
                    <span className="text-gray-500 text-xs font-normal"> / night</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col grow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-sm font-semibold whitespace-nowrap">
                       <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                       4.8
                    </div>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 text-sm mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {hotel.location}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Link
                      href={`/hotel/${hotel._id}`}
                      className="block w-full text-center bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white dark:hover:text-white py-2.5 rounded-xl font-semibold transition-colors duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                 <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No hotels found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
        
        <div className="mt-10 text-center sm:hidden">
           <Link href="/hotels" className="inline-block border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-full font-medium text-gray-700 dark:text-gray-300">
             View All Hotels
           </Link>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Benefits</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-16 text-gray-900 dark:text-white mt-2">
            Why Choose LuxStay?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                title: "Best Price Guarantee",
                desc: "We ensure you get the best deals and affordable stays without compromising on quality.",
                icon: "₹",
                color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              },
              {
                title: "Secure Booking",
                desc: "Your data is safe with us. We use industry-standard encryption for a 100% secure payment process.",
                icon: "S",
                color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              },
              {
                title: "24/7 Dedicated Support",
                desc: "Our customer support team is always available to help you with any queries or issues.",
                icon: "24",
                color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-8 rounded-2xl bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm transition-transform duration-300 group-hover:scale-110 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
