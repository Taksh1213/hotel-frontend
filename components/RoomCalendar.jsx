"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

export default function RoomCalendar({ roomId }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get(`/bookings/room/${roomId}`);
        setBookings(res.data);
      } catch (error) {
        console.error("Booking fetch error:", error);
      }
    };

    fetchBookings();
  }, [roomId]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Room Availability Calendar
      </h2>

      {bookings.length === 0 ? (
        <p className="text-green-600">This room is currently available</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-4 border rounded-lg bg-red-50"
            >
              <p>
                <b>Booked:</b>{" "}
                {new Date(booking.checkIn).toLocaleDateString()} →{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>

              <p>
                <b>Customer:</b> {booking.customerName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}