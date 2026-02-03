import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPaw } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../services/api";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Example: http://localhost:8080

const Animals = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const res = await api.get("/api/animals");

      console.log("ANIMALS API RESPONSE 👉", res.data);

      const animalList = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setAnimals(animalList);
    } catch (err) {
      console.error(
        "ANIMALS API ERROR 👉",
        err.response?.status,
        err.response?.data,
      );
      toast.error("Failed to load animals");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Loading animals...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Animals Available for Adoption 🐾
      </h1>

      {animals.length === 0 ? (
        <p className="text-gray-600">No animals available right now.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => {
            const imageSrc = animal.photo
              ? `${BASE_URL}/${animal.photo}`
              : null;

            return (
              <div
                key={animal.id}
                className="bg-white rounded-xl shadow hover:-translate-y-1 transition overflow-hidden"
              >
                {/* IMAGE */}
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={animal.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/dog-placeholder.png";
                      }}
                    />
                  ) : (
                    <FaPaw className="text-gray-400 text-6xl" />
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5 space-y-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {animal.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {animal.category} • {animal.breed || "Unknown breed"}
                  </p>

                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FaMapMarkerAlt />
                    {animal.location || "Location not available"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Age: {animal.age} yrs • Gender: {animal.gender}
                  </p>

                  <Link
                    to={`/customer/apply-adoption/${animal.id}`}
                    className="
                            mt-4 w-full
                            bg-blue-500 text-white font-semibold
                            py-2 px-4
                            rounded-lg
                            shadow-md
                            hover:bg-blue-700
                            hover:shadow-lg
                            active:scale-95
                            transition-all duration-200
                            inline-block text-center
                            "
                  >
                    Apply for Adoption
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Animals;
