import Link from "next/link";

export default function RoomCard({ room }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
      <h2 className="font-semibold text-xl text-gray-900 dark:text-white">{room.type}</h2>
      <p className="text-gray-600 dark:text-gray-300">Room Number: {room.roomNumber}</p>
      <p className="text-gray-600 dark:text-gray-300">Price: ₹{room.price}</p>
      <p className="text-gray-600 dark:text-gray-300">Status: {room.status}</p>
      <Link href={`/hotel/${room._id}`}>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          View / Book
        </button>
      </Link>
    </div>
  );
}
