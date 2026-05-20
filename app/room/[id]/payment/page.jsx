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
  const totalAmountParam = searchParams.get("amount");
  const totalAmount = totalAmountParam ? parseFloat(totalAmountParam) : 0;

  /* ===============================
     FETCH ROOM DETAILS
  =============================== */

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await API.get(`/rooms/${roomId}`);
        setRoom(res.data);
      } catch (err) {
        setError("Failed to load room details");
      } finally {
        setFetching(false);
      }
    };

    if (roomId) fetchRoom();
  }, [roomId]);

  /* ===============================
     STRIPE PAYMENT
  =============================== */

  const handleStripePayment = async () => {
    try {
      const token = localStorage.getItem("token");

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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert("Payment URL not received");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     PAY AT HOTEL
  =============================== */

  const handlePayAtHotel = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        router.push("/login");
        return;
      }

      if (!checkIn || !checkOut || !totalAmount) {
        alert("Invalid booking details");
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking confirmed! Pay at hotel.");
      router.push("/my-bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setHotelLoading(false);
    }
  };

  /* ===============================
     LOADING
  =============================== */

  if (fetching) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center dark:text-white">
          Loading room info...
        </div>
        <Footer />
      </>
    );
  }

  /* ===============================
     ERROR
  =============================== */

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  /* ===============================
     UI
  =============================== */

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-6">

        {/* BACK BUTTON */}

        <div className="w-full max-w-md mb-4">
          <button
            onClick={() => router.back()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            ← Back
          </button>
        </div>

        {/* PAYMENT CARD */}

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">

          <h1 className="text-3xl font-bold mb-6 dark:text-white">
            💳 Payment Options
          </h1>

          {room && (
            <div className="mb-6 space-y-1">

              <p className="text-gray-700 dark:text-gray-300">
                Room: {room.roomNumber} ({room.type})
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                Check-in: {checkIn || "N/A"}
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                Check-out: {checkOut || "N/A"}
              </p>

              <p className="text-lg font-semibold text-green-600 mt-2">
                Total Amount: ₹{totalAmount.toLocaleString()}
              </p>

            </div>
          )}

          {/* STRIPE */}

          <button
            onClick={handleStripePayment}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mb-4"
          >
            {loading ? "Processing..." : "Pay Online (Stripe)"}
          </button>

          {/* PAY AT HOTEL */}

          <button
            onClick={handlePayAtHotel}
            disabled={hotelLoading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {hotelLoading ? "Booking..." : "Pay at Hotel"}
          </button>

        </div>

      </main>

      <Footer />
    </>
  );
}