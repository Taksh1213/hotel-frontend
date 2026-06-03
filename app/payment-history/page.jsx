
"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import API from "@/services/api";

import Header from "@/components/Header";

import Footer from "@/components/Footer";

export default function PaymentHistoryPage() {

  const [payments, setPayments] =
  useState([]);

  const [loading, setLoading] =
  useState(true);

  const router =
  useRouter();

  /* ===========================
     FETCH PAYMENT HISTORY
  =========================== */

  const fetchPayments =
  async () => {

    try {

      const token =
      localStorage.getItem(
        "token"
      );

      const res =
      await API.get(

        "/payments/history",

        {
          headers: {
            Authorization:
            `Bearer ${token}`,
          },
        }

      );

      console.log(
        "PAYMENTS:",
        res.data
      );

      setPayments(
        res.data
      );

    } catch (error) {

      console.log(
        "Payment History Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchPayments();

  }, []);

  /* ===========================
     LOADING
  =========================== */

  if (loading) {

    return (
      <>
        <Header />

        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">

          <div className="text-center">

            <div className="animate-spin h-12 w-12 border-b-4 border-blue-600 rounded-full mx-auto"></div>

            <p className="mt-4 text-gray-500 dark:text-gray-400">

              Loading payment history...

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

          {/* ===========================
             TOP SECTION
          =========================== */}

          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 mb-10">

            <div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">

                Payment History

              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-2">

                View all your payment transactions

              </p>

            </div>

            <button
              onClick={() =>
                router.back()
              }
              className="px-5 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-xl shadow hover:shadow-lg transition"
            >
              Back
            </button>

          </div>

          {/* ===========================
             TOTAL TRANSACTIONS CARD
          =========================== */}

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-10 border border-gray-100 dark:border-gray-700">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500 dark:text-gray-400">

                  Total Transactions

                </p>

                <h2 className="text-5xl font-bold text-blue-600 mt-2">

                  {payments.length}

                </h2>

              </div>

            </div>

          </div>

          {/* ===========================
             EMPTY STATE
          =========================== */}

          {payments.length === 0 ? (

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-gray-100 dark:border-gray-700">

              <h2 className="text-2xl font-bold text-gray-700 dark:text-white">

                No Payment History Found

              </h2>

              <p className="text-gray-500 dark:text-gray-400 mt-3">

                Your successful Stripe payments will appear here.

              </p>

            </div>

          ) : (

            <div className="grid lg:grid-cols-2 gap-8">

              {payments.map((payment) => (

                <div
                  key={payment._id}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:scale-[1.02] transition duration-300 border border-gray-100 dark:border-gray-700"
                >

                  {/* ===========================
                     CARD HEADER
                  =========================== */}

                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">

                    <div className="flex justify-between items-center">

                      <h2 className="font-bold text-xl">

                        Room {
                          payment.room?.roomNumber
                        }

                      </h2>

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-bold ${
                          (
                            payment.paymentStatus ||
                            ""
                          ).toLowerCase() === "paid"

                            ? "bg-green-100 text-green-700"

                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {
                          payment.paymentStatus ||
                          "Paid"
                        }
                      </span>

                    </div>

                  </div>

                  {/* ===========================
                     CARD BODY
                  =========================== */}

                  <div className="p-5 sm:p-6 space-y-4">

                    <div className="flex justify-between gap-4">

                      <span className="text-gray-500">

                        Room Type

                      </span>

                      <strong className="text-gray-900 dark:text-white">

                        {
                          payment.room?.type ||
                          "N/A"
                        }

                      </strong>

                    </div>

                    <div className="flex justify-between gap-4">

                      <span className="text-gray-500">

                        Payment Method

                      </span>

                      <strong className="text-gray-900 dark:text-white">

                        {
                          payment.paymentMethod ||
                          "Stripe"
                        }

                      </strong>

                    </div>

                    <div className="flex justify-between gap-4">

                      <span className="text-gray-500">

                        Date

                      </span>

                      <strong className="text-gray-900 dark:text-white">

                        {new Date(
                          payment.createdAt
                        ).toLocaleDateString()}

                      </strong>

                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div className="flex justify-between gap-4 items-center text-gray-700 dark:text-gray-300">

                      <span className="font-medium">

                        Total Amount

                      </span>

                      <span className="text-2xl font-bold text-green-600">

                        ₹{
                          (
                            payment.totalAmount ||
                            0
                          ).toLocaleString()
                        }

                      </span>

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

