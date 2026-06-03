"use client";

import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function InactivityWarningModal() {
  const { isIdleWarningOpen, idleCountdown, stayLoggedIn, logout } = useAuth();

  return (
    <AnimatePresence>
      {isIdleWarningOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={stayLoggedIn}
            className="absolute inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 p-6 sm:p-8 text-center shadow-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl"
          >
            {/* Pulsing warning ring icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30">
              <span className="relative flex h-8 w-8">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-8 w-8 bg-amber-500 items-center justify-center text-white text-lg font-bold">
                  ⚠️
                </span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Are you still there?
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">
              You have been inactive for a while. To protect your security, you will be automatically logged out in:
            </p>

            {/* Floating glowing timer circle */}
            <div className="relative flex items-center justify-center w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"
                style={{ animationDuration: "3s" }}
              />
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-amber-500 dark:text-amber-400 font-mono">
                  {idleCountdown}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                  seconds
                </span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={logout}
                className="w-full sm:w-1/3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-semibold transition text-sm order-2 sm:order-1"
              >
                Logout Now
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={stayLoggedIn}
                className="w-full sm:w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition text-sm shadow-lg shadow-blue-500/20 order-1 sm:order-2"
              >
                Stay Logged In
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
