import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hotel Management",
    template: "%s | Hotel Management",
  },
  description: "Hotel booking and management system",
  keywords: ["hotel", "booking", "rooms", "hotel management", "travel"],
  authors: [{ name: "Hotel Management System" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          min-h-screen 
          bg-white 
          text-gray-900 
          dark:bg-gray-900 
          dark:text-gray-100 
          transition-colors 
          duration-300
        `}
      >
        {children}
      </body>
    </html>
  );
}