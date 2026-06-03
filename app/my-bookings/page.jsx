
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

      const res = await API.get(
        "/bookings/my",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setBookings(res.data);

    } catch (error) {

      console.error(
        "Error fetching bookings",
        error
      );

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

  const confirmCancel =
  confirm(
    "Are you sure you want to cancel this booking?"
  );

  if (!confirmCancel)
    return;

  try {

    const token =
    localStorage.getItem(
      "token"
    );

    await API.delete(

      `/bookings/cancel/${id}`,

      {
        headers: {
          Authorization:
          `Bearer ${token}`,
        },
      }

    );

    alert(
      "Booking cancelled successfully"
    );

    /* REFRESH BOOKINGS */

    fetchBookings();

  } catch (error) {

    console.error(
      "Cancel booking error:",
      error
    );

    alert(

      error.response?.data?.message ||

      "Failed to cancel booking"

    );

  }

};



  /* ===============================
     PAY ONLINE
  =============================== */

  const payOnline = async (
    booking
  ) => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await API.post(
          "/payment/create-checkout-session",
          {
            roomId:
              booking.room._id,

            checkIn:
              booking.checkIn,

            checkOut:
              booking.checkOut,

            amount:
              booking.totalAmount,
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (res.data.url) {
        window.location.href =
          res.data.url;
      }

    } catch (error) {

      alert(
        "Payment failed"
      );

    }
  };

  /* LOADING */

  if (loading) {
    return (
      <>
        <Header />

        <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">

          <div className="text-center">

            <div className="animate-spin h-12 w-12 rounded-full border-b-4 border-blue-600 mx-auto"></div>

            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading bookings...
            </p>

          </div>

        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 py-8 sm:py-10 px-4 sm:px-5 transition-colors">

        <div className="max-w-7xl mx-auto">

          {/* TOP HEADER */}

          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 mb-10">

            <div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">

                My Bookings

              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-2">

                Manage your hotel reservations

              </p>

            </div>

            <button
              onClick={() =>
                router.back()
              }
              className="md:mt-0 px-6 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl shadow hover:shadow-lg"
            >
              Back
            </button>

          </div>

          {/* TOTAL CARD */}

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl mb-10 border border-gray-100 dark:border-gray-700">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500 dark:text-gray-400">

                  Total Bookings

                </p>

                <h2 className="text-4xl font-bold text-blue-600">

                  {bookings.length}

                </h2>

              </div>

            </div>

          </div>

          {/* EMPTY */}

          {bookings.length === 0 ? (

            <div className="bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-3xl shadow-xl text-center border border-gray-100 dark:border-gray-700">

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">

                No Bookings Found

              </h2>

            </div>

          ) : (

            <div className="grid lg:grid-cols-2 gap-8">

              {bookings.map(
                (booking) => (

                  <div
                    key={
                      booking._id
                    }
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:scale-[1.02] transition border border-gray-100 dark:border-gray-700"
                  >

                    {/* CARD TOP */}

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">

                      <div className="flex justify-between items-center">

                        <h2 className="text-xl font-bold">

                          Room {booking.room?.roomNumber}

                        </h2>

                        <span
                          className={`px-4 py-1 rounded-full text-sm font-bold ${
                            booking.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.paymentStatus || "Pending"}
                        </span>

                      </div>

                    </div>

                    {/* BODY */}

                    <div className="p-5 sm:p-6 space-y-4">

                      <div className="flex justify-between gap-4">

                        <span className="text-gray-500">
                          Room Type
                        </span>

                        <strong className="text-gray-900 dark:text-white">
                          {booking.room?.type}
                        </strong>

                      </div>

                      <div className="flex justify-between gap-4">

                        <span className="text-gray-500">
                          Check In
                        </span>

                        <strong className="text-gray-900 dark:text-white">
                          {new Date(
                            booking.checkIn
                          ).toLocaleDateString()}
                        </strong>

                      </div>

                      <div className="flex justify-between gap-4">

                        <span className="text-gray-500">
                          Check Out
                        </span>

                        <strong className="text-gray-900 dark:text-white">
                          {new Date(
                            booking.checkOut
                          ).toLocaleDateString()}
                        </strong>

                      </div>

                      <div className="flex justify-between gap-4">

                        <span className="text-gray-500">
                          Payment Method
                        </span>

                        <strong className="text-gray-900 dark:text-white">
                          {booking.paymentMethod}
                        </strong>

                      </div>

                      <hr className="border-gray-200 dark:border-gray-700" />

                      <div className="flex justify-between gap-4 items-center text-gray-700 dark:text-gray-300">

                        <span>
                          Total Amount
                        </span>

                        <span className="text-2xl font-bold text-green-600">

                          ₹{booking.totalAmount}

                        </span>

                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">

                        {booking.paymentStatus !== "Paid" && (

                          <button
                            onClick={() =>
                              payOnline(
                                booking
                              )
                            }
                            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold"
                          >
                            Pay Now
                          </button>

                        )}

                        <button
                          onClick={() =>
                            cancelBooking(
                              booking._id
                            )
                          }
                          className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold"
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </main>

      <Footer />
    </>
  );
}

