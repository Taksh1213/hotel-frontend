"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">

        {/* HERO SECTION */}

        <div className="bg-indigo-600 text-white py-16 sm:py-20 text-center px-4">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">About LuxStay</h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto">
            A modern hotel booking platform designed to make room reservations
            easy, fast, and secure for travelers around the world.
          </p>
        </div>

        {/* ABOUT CONTENT */}

        <section className="max-w-6xl mx-auto px-6 py-16">

          <div className="grid md:grid-cols-2 gap-10 items-center">

              <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/hotel-about.jpg"
                alt="Hotel lobby"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-4 dark:text-white">
                Who We Are
              </h2>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our Hotel Management System is designed to simplify hotel room
                reservations. Users can browse hotels, check available rooms,
                book instantly, and choose flexible payment options.
              </p>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Built with modern technologies like Next.js and Node.js, our
                platform ensures a smooth and secure experience for both guests
                and hotel administrators.
              </p>
            </div>

          </div>

        </section>

        {/* FEATURES */}

        <section className="bg-white dark:bg-gray-800 py-16">

          <div className="max-w-6xl mx-auto px-6">

            <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
              Our Features
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

              <div className="p-6 rounded-xl shadow hover:shadow-lg transition bg-gray-50 dark:bg-gray-700">
                <h3 className="text-xl font-semibold mb-3 dark:text-white">
                  Easy Booking
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Quickly find and book available rooms with a smooth and
                  simple booking process.
                </p>
              </div>

              <div className="p-6 rounded-xl shadow hover:shadow-lg transition bg-gray-50 dark:bg-gray-700">
                <h3 className="text-xl font-semibold mb-3 dark:text-white">
                  Secure Payments
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose between online payments or pay directly at the hotel
                  with full booking confirmation.
                </p>
              </div>

              <div className="p-6 rounded-xl shadow hover:shadow-lg transition bg-gray-50 dark:bg-gray-700">
                <h3 className="text-xl font-semibold mb-3 dark:text-white">
                  Real-Time Availability
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Instantly see which rooms are available with real-time
                  updates.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* WHY CHOOSE US */}

        <section className="max-w-6xl mx-auto px-6 py-16">

          <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">
            Why Choose Us
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">

            <div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Fast Booking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Book your room within seconds without complicated steps.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                Trusted Platform
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Secure booking system trusted by many users.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                24/7 Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our support team is always available to assist you.
              </p>
            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
