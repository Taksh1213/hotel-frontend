
"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentPage() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const totalAmountParam =
    searchParams.get("amount");

  const totalAmount =
    totalAmountParam
      ? parseFloat(totalAmountParam)
      : 0;

  /* FETCH ROOM */

  useEffect(() => {

    const fetchRoom = async () => {
      try {

        const res = await API.get(
          `/rooms/${roomId}`
        );

        setRoom(res.data);

      } catch (err) {

        setError(
          "Failed to load room details"
        );

      } finally {

        setFetching(false);

      }
    };

    if (roomId) {
      fetchRoom();
    }

  }, [roomId]);

  /* STRIPE */

  const handleStripePayment = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        alert("Please login first");

        router.push("/login");

        return;
      }

      setLoading(true);

      const res = await API.post(
        "/payment/create-checkout-session",

        {
          roomId,
          checkIn,
          checkOut,
          amount: totalAmount,
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

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Payment failed"
      );

    } finally {

      setLoading(false);

    }
  };

  /* PAY HOTEL */

  const handlePayAtHotel = async () => {

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        alert("Please login first");

        router.push("/login");

        return;
      }

      setHotelLoading(true);

      await API.post(
        "/bookings",

        {
          room: roomId,
          checkIn,
          checkOut,
          totalAmount,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Booking confirmed!"
      );

      router.push(
        "/my-bookings"
      );

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Booking failed"
      );

    } finally {

      setHotelLoading(false);

    }
  };

  if (fetching) {

    return (
      <>
        <Header />

        <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">

          <div className="text-center">

            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600 mx-auto"></div>

            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading...
            </p>

          </div>

        </div>

        <Footer />
      </>
    );
  }

  if (error) {

    return (
      <>
        <Header />

        <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">

          <h1 className="text-red-600 text-2xl">

            {error}

          </h1>

        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 py-8 sm:py-10 px-4 sm:px-5 transition-colors">

        <div className="max-w-7xl mx-auto">

          <button
            onClick={() => router.back()}
            className="mb-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-5 py-3 rounded-xl shadow hover:shadow-lg"
          >
            Back
          </button>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT */}

            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-5 sm:p-8 border border-gray-100 dark:border-gray-700">

              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">

                Payment Details

              </h1>

              <p className="text-gray-500 dark:text-gray-400 mb-8">

                Review your booking

              </p>

              {room && (

                <div className="space-y-5">

                  <div className="flex justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 text-gray-700 dark:text-gray-300">

                    <span>
                      Room Number
                    </span>

                    <strong>
                      #{room.roomNumber}
                    </strong>

                  </div>

                  <div className="flex justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 text-gray-700 dark:text-gray-300">

                    <span>
                      Room Type
                    </span>

                    <strong>
                      {room.type}
                    </strong>

                  </div>

                  <div className="flex justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 text-gray-700 dark:text-gray-300">

                    <span>
                      Check In
                    </span>

                    <strong>
                      {checkIn}
                    </strong>

                  </div>

                  <div className="flex justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 text-gray-700 dark:text-gray-300">

                    <span>
                      Check Out
                    </span>

                    <strong>
                      {checkOut}
                    </strong>

                  </div>

                </div>

              )}

            </div>

            {/* RIGHT */}

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-5 sm:p-8 h-fit border border-gray-100 dark:border-gray-700">

              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">

                Payment Summary

              </h2>

              <div className="space-y-5">

                <div className="flex justify-between gap-4 text-gray-700 dark:text-gray-300">

                  <span>
                    Total Amount
                  </span>

                  <strong className="text-2xl text-green-600">

                    ₹{totalAmount.toLocaleString()}

                  </strong>

                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <button
                  onClick={handleStripePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold"
                >
                  {loading
                    ? "Processing..."
                    : "Pay Online"}
                </button>

                <button
                  onClick={handlePayAtHotel}
                  disabled={hotelLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold"
                >
                  {hotelLoading
                    ? "Booking..."
                    : "Pay at Hotel"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}
