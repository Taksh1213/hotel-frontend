"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <>
      <Header />

      <main className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-red-600 mb-4">❌ Payment Cancelled</h1>
          <p className="text-gray-700 mb-6">
            Your payment was not completed. You can try again or choose another room.
          </p>
          <button
            onClick={() => router.push("/rooms")}
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