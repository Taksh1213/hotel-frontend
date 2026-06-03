
"use client";

import { useParams, useRouter } from "next/navigation";

import {
  useEffect,
  useState
} from "react";

import Image from "next/image";
import API from "@/services/api";
import { normalizeImageUrl } from "@/utils/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";

import Footer from "@/components/Footer";

export default function BookingPage() {

  const { id } =
  useParams();

  const router =
  useRouter();

  const [room, setRoom] =
  useState(null);

  const [loading, setLoading] =
  useState(true);

  const [bookedDates, setBookedDates] =
  useState([]);

  const [name, setName] =
  useState("");

  const [email, setEmail] =
  useState("");

  const [phone, setPhone] =
  useState("");

  const [guests, setGuests] =
  useState(1);

  const [checkIn, setCheckIn] =
  useState("");

  const [checkOut, setCheckOut] =
  useState("");

  const [totalNights, setTotalNights] =
  useState(0);

  const [totalAmount, setTotalAmount] =
  useState(0);

  /* ===============================
     FETCH ROOM + BOOKINGS
  =============================== */

  useEffect(() => {

    if (!id) return;

    const fetchData =
    async () => {

      try {

        /* ROOM */

        const roomRes =
        await API.get(
          `/rooms/${id}`
        );

        setRoom(roomRes.data);

        /* ROOM BOOKINGS */

        const bookingRes =
        await API.get(
          `/bookings/room/${id}`
        );

        setBookedDates(
          bookingRes.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, [id]);

  /* ===============================
     CALCULATE TOTAL
  =============================== */

  useEffect(() => {

    if (
      !checkIn ||
      !checkOut ||
      !room
    ) {

      setTotalNights(0);

      setTotalAmount(0);

      return;

    }

    const start =
    new Date(checkIn);

    const end =
    new Date(checkOut);

    const diff =

      (end - start) /

      (1000 * 60 * 60 * 24);

    const nights =
    diff > 0 ? diff : 0;

    setTotalNights(nights);

    setTotalAmount(
      nights * room.price
    );

  }, [
    checkIn,
    checkOut,
    room
  ]);

  /* ===============================
     CHECK BOOKED DATES
  =============================== */

  const isDateBooked =
  () => {

    return bookedDates.some(
      (booking) => {

        const bookedCheckIn =
        new Date(
          booking.checkIn
        );

        const bookedCheckOut =
        new Date(
          booking.checkOut
        );

        const selectedCheckIn =
        new Date(checkIn);

        const selectedCheckOut =
        new Date(checkOut);

        return (

          selectedCheckIn <
          bookedCheckOut &&

          selectedCheckOut >
          bookedCheckIn

        );

      }
    );

  };

  /* ===============================
     PAYMENT
  =============================== */

  const handlePayment =
  () => {

    if (

      !name ||
      !email ||
      !phone ||
      !checkIn ||
      !checkOut

    ) {

      alert(
        "Please fill all fields"
      );

      return;

    }

    if (isDateBooked()) {

      alert(
        "Selected dates are already booked"
      );

      return;

    }

    router.push(

      `/room/${id}/payment?checkIn=${checkIn}&checkOut=${checkOut}&amount=${totalAmount}`

    );

  };

  /* ===============================
     LOADING
  =============================== */

  if (loading) {

    return (
      <>
        <Header />

        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
          <LoadingSpinner text="Loading Room..." />
        </div>

        <Footer />
      </>
    );
  }

  /* ===============================
     ROOM NOT FOUND
  =============================== */

  if (!room) {

    return (
      <>
        <Header />

        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">

          <h1 className="text-3xl font-bold text-red-600">

            Room Not Found

          </h1>

        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 py-8 sm:py-10 px-4 sm:px-5 transition-colors">

        <div className="max-w-7xl mx-auto">

          {/* BACK BUTTON */}

          <button
            onClick={() =>
              router.back()
            }
            className="mb-6 px-5 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl shadow hover:shadow-lg transition"
          >
            Back
          </button>

          {/* ROOM IMAGE SECTION */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-lg mb-8">
            <Image
              src={room.image ? normalizeImageUrl(room.image) || "/noimage.jpg" : "/noimage.jpg"}
              alt={room.type || "Room"}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* FORM */}

            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700">

              <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">

                Book Room {
                  room.roomNumber
                }

              </h1>

              <p className="text-gray-500 dark:text-gray-400 mb-8">

                Fill your booking details

              </p>

              <div className="grid md:grid-cols-2 gap-5">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e)=>
                    setName(
                      e.target.value
                    )
                  }
                  className="border p-4 rounded-xl bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e)=>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="border p-4 rounded-xl bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                />

                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e)=>
                    setPhone(
                      e.target.value
                    )
                  }
                  className="border p-4 rounded-xl bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                />

                <input
                  type="number"
                  min="1"
                  placeholder="Guests"
                  value={guests}
                  onChange={(e)=>
                    setGuests(
                      e.target.value
                    )
                  }
                  className="border p-4 rounded-xl bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                />

                {/* CHECK IN */}

                <input
                  type="date"
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  value={checkIn}
                  onChange={(e)=>
                    setCheckIn(
                      e.target.value
                    )
                  }
                  className={`border p-4 rounded-xl bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 ${
                    checkIn &&
                    checkOut &&
                    isDateBooked()

                      ? "border-red-500 bg-red-50 dark:bg-red-950/20"

                      : ""
                  }`}
                />

                {/* CHECK OUT */}

                <input
                  type="date"
                  min={
                    checkIn ||

                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  value={checkOut}
                  onChange={(e)=>
                    setCheckOut(
                      e.target.value
                    )
                  }
                  className={`border p-4 rounded-xl bg-white dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 ${
                    checkIn &&
                    checkOut &&
                    isDateBooked()

                      ? "border-red-500 bg-red-50 dark:bg-red-950/20"

                      : ""
                  }`}
                />

              </div>

              {/* BOOKED WARNING */}

              {checkIn &&
               checkOut &&
               isDateBooked() && (

                <div className="mt-6 bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-xl">

                  ⚠ Selected dates are already booked

                </div>

              )}

            </div>

            {/* SUMMARY */}

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-5 sm:p-8 h-fit border border-gray-100 dark:border-gray-700">

              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">

                Booking Summary

              </h2>

              <div className="space-y-4">

                <div className="flex justify-between gap-4 text-gray-700 dark:text-gray-300">

                  <span>Room</span>

                  <strong>
                    #{room.roomNumber}
                  </strong>

                </div>

                <div className="flex justify-between gap-4 text-gray-700 dark:text-gray-300">

                  <span>Type</span>

                  <strong>
                    {room.type}
                  </strong>

                </div>

                <div className="flex justify-between gap-4 text-gray-700 dark:text-gray-300">

                  <span>Price/Night</span>

                  <strong className="text-green-600">

                    ₹{room.price}

                  </strong>

                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="flex justify-between gap-4 text-gray-700 dark:text-gray-300">

                  <span>Total Nights</span>

                  <strong>
                    {totalNights}
                  </strong>

                </div>

                <div className="flex justify-between text-xl font-bold text-blue-600">

                  <span>
                    Total Amount
                  </span>

                  <span>

                    ₹{
                      totalAmount.toLocaleString()
                    }

                  </span>

                </div>

              </div>

              <button
                onClick={handlePayment}
                disabled={
                  isDateBooked()
                }
                className={`w-full mt-8 py-4 rounded-xl font-bold text-white transition ${
                  isDateBooked()

                    ? "bg-gray-400 cursor-not-allowed"

                    : "bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90"
                }`}
              >
                {
                  isDateBooked()

                  ? "Dates Unavailable"

                  : "Proceed To Payment"
                }
              </button>

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

