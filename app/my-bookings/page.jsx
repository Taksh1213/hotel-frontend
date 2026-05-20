"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* ===============================
     FETCH BOOKINGS
  =============================== */

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ===============================
     CANCEL BOOKING
  =============================== */

  const cancelBooking = async (id) => {
    const confirmCancel = confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Booking cancelled successfully");

      fetchBookings();
    } catch (error) {
      alert("Failed to cancel booking");
    }
  };

  /* ===============================
     PAY ONLINE
  =============================== */

  const payOnline = async (booking) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/payment/create-checkout-session",
        {
          roomId: booking.room._id,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          amount: booking.totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      alert("Payment failed");
    }
  };

  /* ===============================
     LOADING
  =============================== */

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center dark:text-white">
          Loading bookings...
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors p-8">

        {/* BACK BUTTON */}

        <div className="max-w-5xl mx-auto mb-6">
          <button
            onClick={() => router.back()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            ← Back
          </button>
        </div>

        {/* TITLE */}

        <h1 className="text-3xl font-bold mb-10 text-center dark:text-white">
          🛎️ My Bookings
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No bookings found.
          </p>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">

            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border dark:border-gray-700 hover:shadow-2xl transition"
              >

                {/* HEADER */}

                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold dark:text-white">
                    Room {booking.room?.roomNumber}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.paymentStatus || "Pending"}
                  </span>
                </div>

                {/* DETAILS */}

                <p className="text-gray-600 dark:text-gray-300">
                  Room Type: {booking.room?.type}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  Check-in: {new Date(booking.checkIn).toLocaleDateString()}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  Check-out: {new Date(booking.checkOut).toLocaleDateString()}
                </p>

                <p className="text-gray-800 dark:text-white font-semibold mt-2">
                  Total: ₹{booking.totalAmount}
                </p>

                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Payment Method: {booking.paymentMethod}
                </p>

                {/* ACTION BUTTONS */}

                <div className="flex gap-3 mt-5 flex-wrap">

                  {booking.paymentStatus !== "Paid" && (
                    <button
                      onClick={() => payOnline(booking)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Pay Online
                    </button>
                  )}

                  <button
                    onClick={() => cancelBooking(booking._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel Booking
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}
      </main>

      <Footer />
    </>
  );
}