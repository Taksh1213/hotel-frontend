"use client";
import { useEffect, useState } from "react";
import API from "../../services/api";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    const res = await API.get("/hotels");
    setHotels(res.data);
  };

  const filteredHotels = hotels.filter((hotel) => {
    return (
      hotel.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? hotel.category === category : true)
    );
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-6">Explore Hotels</h1>

        {/* Search + Filter */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search hotel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="Luxury">Luxury</option>
            <option value="Budget">Budget</option>
            <option value="Business">Business</option>
          </select>
        </div>

        {/* Hotel Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-bold">{hotel.name}</h2>
                <p className="text-gray-600">{hotel.category}</p>

                <Link
                  href={`/hotel/${hotel._id}`}
                  className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  View Rooms
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}