"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <>
      <Header />

      <main className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-gray-950 p-4 sm:p-6 transition-colors">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-2xl shadow-lg text-center max-w-md w-full border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl sm:text-4xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Your payment was not completed. You can try again or choose another room.
          </p>
          <button
            onClick={() => router.push("/hotels")}
            className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition"
          >
            Back to Rooms
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
