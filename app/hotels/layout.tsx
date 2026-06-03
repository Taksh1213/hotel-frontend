import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Hotels",
  description:
    "Search hotels by name or location, compare nightly prices, and view available rooms for your next stay.",
  alternates: {
    canonical: "/hotels",
  },
};

export default function HotelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
