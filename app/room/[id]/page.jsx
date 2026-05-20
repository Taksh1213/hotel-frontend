"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [totalNights, setTotalNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  /* FETCH ROOM */

  useEffect(() => {
    if (!id) return;

    const fetchRoom = async () => {
      try {
        const res = await API.get(`/rooms/${id}`);
        setRoom(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  /* CALCULATE TOTAL */

  useEffect(() => {
    if (!checkIn || !checkOut || !room) {
      setTotalNights(0);
      setTotalAmount(0);
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const diff = (end - start) / (1000 * 60 * 60 * 24);
    const nights = diff > 0 ? diff : 0;

    setTotalNights(nights);
    setTotalAmount(nights * room.price);
  }, [checkIn, checkOut, room]);

  /* PAYMENT */

  const handlePayment = () => {
    if (!name || !email || !phone || !checkIn || !checkOut) {
      alert("Please fill all fields");
      return;
    }

    if (room.status === "Booked") {
      alert("Room already booked!");
      return;
    }

    router.push(
      `/room/${id}/payment?checkIn=${checkIn}&checkOut=${checkOut}&amount=${totalAmount}`
    );
  };

  /* LOADING */

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center dark:text-white">
          Loading...
        </div>
        <Footer />
      </>
    );
  }

  if (!room) {
    return (
      <>
        <Header />
        <p className="p-6 text-center dark:text-white">Room not found</p>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors flex flex-col items-center justify-center p-6">

        {/* BACK BUTTON */}

        <div className="w-full max-w-2xl mb-4">
          <button
            onClick={() => router.back()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            ← Back
          </button>
        </div>

        {/* BOOKING CARD */}

        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">

          <h1 className="text-3xl font-bold mb-4 dark:text-white text-center">
            Book Room {room.roomNumber}
          </h1>

          <p className="dark:text-gray-300 text-center">Type: {room.type}</p>

          <p className="text-green-600 font-semibold mb-6 text-center">
            ₹{room.price} / Night
          </p>

          {room.status === "Booked" && (
            <p className="text-red-600 font-bold mb-4 text-center">
              This room is already booked
            </p>
          )}

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-3 rounded dark:bg-gray-700 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border p-3 rounded dark:bg-gray-700 dark:text-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="number"
              min="1"
              placeholder="Number of Guests"
              className="w-full border p-3 rounded dark:bg-gray-700 dark:text-white"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />

            <div>
              <label className="dark:text-gray-300">Check-in</label>
              <input
                type="date"
                className="w-full border p-3 rounded dark:bg-gray-700 dark:text-white"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div>
              <label className="dark:text-gray-300">Check-out</label>
              <input
                type="date"
                className="w-full border p-3 rounded dark:bg-gray-700 dark:text-white"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            {totalNights > 0 && (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-center">
                <p className="dark:text-white">Total Nights: {totalNights}</p>
                <p className="font-bold text-lg dark:text-white">
                  Total Amount: ₹{totalAmount.toLocaleString()}
                </p>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={room.status === "Booked"}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              Proceed To Payment
            </button>

          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}