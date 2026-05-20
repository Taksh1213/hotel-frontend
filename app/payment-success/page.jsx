"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const amountParam = searchParams.get("amount");
  const totalAmount = amountParam ? parseFloat(amountParam) : 0;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch room details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (!roomId) return;
        const res = await API.get(`/rooms/${roomId}`);
        setRoom(res.data);
      } catch (err) {
        console.error("Error fetching room:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  // Calculate total nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading booking details...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
          <p className="text-gray-700 mb-6">Thank you for your booking.</p>

          {room && (
            <div className="text-left bg-green-100 p-4 rounded mb-6">
              <p>
                <strong>Room:</strong> {room.roomNumber} ({room.type})
              </p>
              <p>
                <strong>Check-in:</strong> {checkIn}
              </p>
              <p>
                <strong>Check-out:</strong> {checkOut}
              </p>
              <p>
                <strong>Total Nights:</strong> {calculateNights()}
              </p>
              <p className="font-bold text-lg">
                <strong>Total Amount:</strong> ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          )}

          <button
            onClick={() => router.push("/rooms")}
            className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition"
          >
            Back to Rooms
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}