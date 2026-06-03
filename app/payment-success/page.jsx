
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import lottie from "lottie-web";

import {
  useSearchParams,
  useRouter
} from "next/navigation";

import API from "@/services/api";

import Header from "@/components/Header";

import Footer from "@/components/Footer";

function PaymentSuccessContent() {
  const animationRef =
  useRef(null);

  const searchParams =
  useSearchParams();

  const router =
  useRouter();

  const roomId =
  searchParams.get("roomId");

  const checkIn =
  searchParams.get("checkIn");

  const checkOut =
  searchParams.get("checkOut");

  const amountParam =
  searchParams.get("amount");

  const totalAmount =
  amountParam
    ? parseFloat(amountParam)
    : 0;

  const [room, setRoom] =
  useState(null);

  const [loading, setLoading] =
  useState(true);

  useEffect(() => {
    if (!animationRef.current)
      return;

    const animation =
    lottie.loadAnimation({
      container: animationRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "/assets/lottie/success.json",
    });

    return () => {
      animation.destroy();
    };
  }, [loading]);

  /* ===============================
     CALCULATE NIGHTS
  =============================== */

  const calculateNights = () => {

    if (!checkIn || !checkOut)
      return 0;

    const start =
    new Date(checkIn);

    const end =
    new Date(checkOut);

    const diff =
    (end - start) /
    (1000 * 60 * 60 * 24);

    return diff > 0
      ? diff
      : 0;
  };

  /* ===============================
     VERIFY PAYMENT
  =============================== */

  useEffect(() => {

    const verifyPayment =
    async () => {

      try {

        if (!roomId)
          return;

        /* TOKEN */

        const token =

        typeof window !==
        "undefined"

        ? localStorage.getItem(
            "token"
          )

        : null;

        console.log(
          "TOKEN:",
          token
        );

        /* FETCH ROOM */

        const roomRes =
        await API.get(
          `/rooms/${roomId}`
        );

        setRoom(roomRes.data);

        /* BOOKING DATA */

        const bookingData = {

          room: roomId,

          checkIn,

          checkOut,

          totalAmount,

          paymentMethod:
            "Stripe",

          paymentStatus:
            "Paid"

        };

        console.log(
          "BOOKING DATA:",
          bookingData
        );

        /* CREATE BOOKING */

        const bookingRes =

        await API.post(

          "/bookings",

          bookingData,

          {
            headers: {
              Authorization:
              `Bearer ${token}`
            }
          }

        );

        console.log(
          "BOOKING CREATED:",
          bookingRes.data
        );

        alert(
          "Booking saved successfully"
        );

      } catch (err) {

        console.error(
          "PAYMENT ERROR:",
          err
        );

        console.error(
          "ERROR RESPONSE:",
          err.response?.data
        );

        alert(

          err.response?.data?.message ||

          "Booking save failed"

        );

      } finally {

        setLoading(false);

      }

    };

    verifyPayment();

  }, []);

  /* ===============================
     LOADING
  =============================== */

  if (loading) {

    return (
      <>
        <Header />

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-950 dark:to-gray-900">

          <div className="text-center">

            <div className="animate-spin h-12 w-12 border-b-4 border-green-600 rounded-full mx-auto"></div>

            <p className="mt-4 text-gray-600 dark:text-gray-300">

              Verifying payment...

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

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 sm:p-6 transition-colors">

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-10 max-w-lg w-full text-center border border-green-100 dark:border-emerald-900/50">

          {/* SUCCESS ICON */}

          <div
            ref={animationRef}
            aria-label="Payment success animation"
            className="mx-auto mb-2 h-32 w-32 sm:h-40 sm:w-40"
          />

          {/* TITLE */}

          <h1 className="text-3xl sm:text-4xl font-bold text-green-600 mb-3">

            Payment Successful

          </h1>

          <p className="text-gray-500 dark:text-gray-400 mb-8">

            Your hotel booking has been confirmed successfully.

          </p>

          {/* BOOKING DETAILS */}

          {room && (

            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-2xl p-5 text-left space-y-3 mb-8">

              <div className="flex justify-between gap-4">

                <span className="text-gray-500">
                  Room
                </span>

                <strong className="text-gray-900 dark:text-white">
                  {room.roomNumber}
                  {" "}
                  ({room.type})
                </strong>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-gray-500">
                  Check In
                </span>

                <strong className="text-gray-900 dark:text-white">
                  {checkIn}
                </strong>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-gray-500">
                  Check Out
                </span>

                <strong className="text-gray-900 dark:text-white">
                  {checkOut}
                </strong>

              </div>

              <div className="flex justify-between gap-4">

                <span className="text-gray-500">
                  Total Nights
                </span>

                <strong className="text-gray-900 dark:text-white">
                  {calculateNights()}
                </strong>

              </div>

              <hr className="border-green-200 dark:border-green-900" />

              <div className="flex justify-between gap-4 items-center text-gray-700 dark:text-gray-300">

                <span className="font-medium">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-green-600">

                  ₹{
                    totalAmount.toLocaleString()
                  }

                </span>

              </div>

            </div>

          )}

          {/* ACTION BUTTONS */}

          <div className="flex flex-col gap-4">

            <button
              onClick={() =>
                router.push(
                  "/my-bookings"
                )
              }
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              My Bookings
            </button>

            <button
              onClick={() =>
                router.push(
                  "/payment-history"
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Payment History
            </button>

            <button
              onClick={() =>
                router.push("/")
              }
              className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 py-3 rounded-xl font-semibold transition"
            >
              Back Home
            </button>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default function PaymentSuccessPage() {

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">

          Loading...

        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

