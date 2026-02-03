import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/api";
import {
  FaPaw,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const MyAdoptions = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAdoptions();
  }, []);

  const fetchMyAdoptions = async () => {
    try {
      const res = await API.get("/api/adoptions/my");
      setAdoptions(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load adoption requests");
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700">
            <FaClock /> Pending
          </span>
        );
      case "APPROVED":
        return (
          <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
            <FaCheckCircle /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-red-100 text-red-700">
            <FaTimesCircle /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Loading your adoptions...</p>
      </div>
    );
  }

  
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Back */}
      <Link
        to="/customer/dashboard"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
      >
        <FaArrowLeft />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FaPaw className="text-blue-600 text-3xl" />
        <h1 className="text-3xl font-bold text-gray-800">
          My Adoption Requests
        </h1>
      </div>

      {/* Empty State */}
      {adoptions.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <FaPaw className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            You haven’t applied for any adoptions yet.
          </p>
          <Link
            to="/customer/animals"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse Animals
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {adoptions.map((adoption) => {
            const imageUrl = adoption.animalPhoto
              ? `${BASE_URL}/${adoption.animalPhoto}`
              : "/dog-placeholder.png";

            return (
              <div
                key={adoption.id}
                className="bg-white rounded-xl shadow p-5 flex gap-5 items-center hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={imageUrl}
                    alt={adoption.animalName || "Animal"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/dog-placeholder.png";
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {adoption.animalName || `Animal #${adoption.animalId}`}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {adoption.animalCategory || "Animal"} • ID #{adoption.animalId}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Applied on: {adoption.adoptionDate || "—"}
                  </p>
                </div>

                {/* Status */}
                <div className="flex flex-col items-end gap-2">
                  {statusBadge(adoption.status)}

                  <Link
                    to="/customer/animals"
                    className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >
                    View Animals
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

export default MyAdoptions;
