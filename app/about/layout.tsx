import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how LuxStay helps travelers find hotels, book rooms, and manage reservations with a modern booking experience.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
