"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/services/api";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HotelDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  const BACKEND_ORIGIN =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "https://hotel-backend-frrj.onrender.com";

  const normalizeImageUrl = (imagePath) => {
    if (!imagePath) return "/noimage.jpg";
    const path = imagePath.replace(/\\/g, "/");
    if (path.startsWith("http")) {
      return path
        .replace("http://localhost:5000", BACKEND_ORIGIN)
        .replace("https://localhost:5000", BACKEND_ORIGIN);
    }
    return `${BACKEND_ORIGIN}/${path.replace(/^\/+/, "")}`;
  };

  const safeGet = async (url) => {
    try {
      const res = await API.get(url);
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const hotelData = await safeGet(`/hotels/${id}`);
        setHotel(hotelData);

        const roomData = (await safeGet(`/rooms/by-hotel/${id}`)) || [];
        setRooms(roomData);

        const bookingData = (await safeGet(`/bookings/by-hotel/${id}`)) || [];
        setBookedDates(
          bookingData.map((b) => ({
            start: new Date(b.checkIn),
            end: new Date(b.checkOut),
          }))
        );
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isDateDisabled = (date) => {
    return bookedDates.some(
      (booking) => date >= booking.start && date <= booking.end
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <p className="p-10 text-center text-xl dark:text-white">
          Loading Hotel...
        </p>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <p className="p-10 text-center text-red-500 text-xl">
          Something went wrong while fetching data.
        </p>
        <Footer />
      </>
    );
  }

  if (!hotel) {
    return (
      <>
        <Header />
        <p className="p-10 text-center text-red-500 text-xl">
          Hotel not found
        </p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">

        {/* HERO SECTION */}
        <div className="relative h-[320px] sm:h-[420px] w-full overflow-hidden">

          <img
            src={normalizeImageUrl(hotel.images?.[0])}
            alt={hotel.name || "Hotel"}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/noimage.jpg")}
          />

          {/* BACK BUTTON */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg hover:bg-black/70 transition z-10"
          >
            Back
          </button>

          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center text-white p-6">

            <h1 className="text-3xl sm:text-5xl font-bold mb-3">
              {hotel.name || "No Name"}
            </h1>

            <p className="text-lg">
              {hotel.location || "Unknown Location"}
            </p>

            <p className="text-2xl mt-3 font-semibold text-emerald-400">
              ₹{hotel.pricePerNight || 0} / Night
            </p>

          </div>
        </div>

        {/* HOTEL DESCRIPTION */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              About Hotel
            </h2>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {hotel.description || "No description available."}
            </p>
          </div>

          {/* ROOMS */}
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">
            Available Rooms
          </h2>

          {rooms.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No rooms available
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition"
                >

                  <div className="relative h-56 overflow-hidden">

                    <img
                      src={
                        room.image
                          ? normalizeImageUrl(room.image)
                          : "/noimage.jpg"
                      }
                      alt={room.type || "Hotel room"}
                      className="w-full h-full object-cover hover:scale-110 transition"
                      onError={(e) => (e.target.src = "/noimage.jpg")}
                    />

                    <div className="absolute top-3 right-3 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm shadow">
                      ₹{room.price || 0}/Night
                    </div>

                  </div>

                  <div className="p-6">

                    <h3 className="text-xl font-bold dark:text-white">
                      {room.type || "Room"}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      Room No: {room.roomNumber || "-"}
                    </p>

                    <span
                      className={`px-3 py-1 text-sm rounded-full font-medium ${
                        room.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {room.status || "Unavailable"}
                    </span>

                    {room.status === "Available" && (
                      <div className="mt-4">
                        <DatePicker
                          selected={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          filterDate={(date) => !isDateDisabled(date)}
                          minDate={new Date()}
                          placeholderText="Select Booking Date"
                      className="w-full border p-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    )}

                    <div className="mt-6">

                      {room.status === "Available" ? (

                        <Link href={`/room/${room._id}`}>
                          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                            Book Now
                          </button>
                        </Link>

                      ) : (

                        <button
                          disabled
                          className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
                        >
                          Not Available
                        </button>

                      )}

                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

      </main>

      <Footer />
    </>
  );
}
