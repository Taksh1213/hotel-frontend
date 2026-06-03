import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment History",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
