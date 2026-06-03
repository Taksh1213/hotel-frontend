"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300 mt-16 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-4">
            LuxStay
          </h2>
          <p className="text-sm">
            Book your dream hotel rooms easily with our modern hotel booking
            platform. Comfortable stays made simple.
          </p>
        </div>

        <div>
          <h3 className="text-slate-950 dark:text-white font-semibold mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link href="/hotels" className="hover:text-blue-600 dark:hover:text-white transition">
                Hotels
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-blue-600 dark:hover:text-white transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-600 dark:hover:text-white transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-blue-600 dark:hover:text-white transition">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-slate-950 dark:text-white font-semibold mb-4">
            Legal
          </h3>
          <ul className="space-y-2">
            <li>
              <span className="text-slate-500 dark:text-slate-500">
                Privacy Policy
              </span>
            </li>
            <li>
              <span className="text-slate-500 dark:text-slate-500">
                Terms & Conditions
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-slate-950 dark:text-white font-semibold mb-4">
            Contact
          </h3>
          <p>Email: support@hotel.com</p>
          <p>Phone: +91 9876543210</p>
          <p>India</p>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 text-center py-4 text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} LuxStay. All rights reserved.
      </div>
    </footer>
  );
}
