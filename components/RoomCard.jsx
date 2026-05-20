import Link from "next/link";

export default function RoomCard({ room }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="font-semibold text-xl">{room.type}</h2>
      <p>Room Number: {room.roomNumber}</p>
      <p>Price: ${room.price}</p>
      <p>Status: {room.status}</p>
      <Link href={`/hotel/${room._id}`}>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          View / Book
        </button>
      </Link>
    </div>
  );
}