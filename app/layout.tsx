
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import InactivityWarningModal from "@/components/InactivityWarningModal";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "LuxStay Hotel Booking",
    template: "%s | LuxStay",
  },
  description:
    "Book hotel rooms online with LuxStay. Browse hotels, compare rooms, manage bookings, and choose secure online or pay-at-hotel options.",
  keywords: [
    "hotel",
    "hotel booking",
    "online hotel booking",
    "booking",
    "rooms",
    "hotel management",
    "travel",
    "LuxStay",
  ],
  authors: [
    {
      name: "LuxStay",
    },
  ],
  creator: "LuxStay",
  publisher: "LuxStay",
  applicationName: "LuxStay",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "LuxStay",
    title: "LuxStay Hotel Booking",
    description:
      "Browse hotels, book rooms, manage reservations, and pay securely online or at the hotel.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "LuxStay hotel booking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxStay Hotel Booking",
    description:
      "Book hotel rooms online and manage your reservations with LuxStay.",
    images: ["/hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <html
      lang="en"
      suppressHydrationWarning
    >

      <body
        suppressHydrationWarning
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
          overflow-x-hidden
        `}
      >
        <AuthProvider>
          {children}
          <InactivityWarningModal />
        </AuthProvider>
      </body>

    </html>
  );
}
