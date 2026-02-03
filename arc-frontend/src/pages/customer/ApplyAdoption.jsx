import { useState } from "react";
import { FaPaw, FaIdCard, FaUpload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const ApplyAdoption = () => {
  const { animalId } = useParams();

  const [govtId, setGovtId] = useState("");
  const [govtIdPhoto, setGovtIdPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!animalId) {
      toast.error("Invalid animal selection");
      return;
    }

    if (!govtId || !govtIdPhoto) {
      toast.error("Please provide all required details");
      return;
    }

    try {
      setLoading(true);

      // ✅ DTO as backend expects
      const adoptionData = {
        animalId: Number(animalId),
        govtId: govtId,
      };

      const formData = new FormData();

      // 🔥 JSON must be sent as Blob
      formData.append(
        "adoption",
        new Blob([JSON.stringify(adoptionData)], {
          type: "application/json",
        })
      );

      formData.append("govtIdPhoto", govtIdPhoto);

      // ❗ DO NOT manually set Content-Type for multipart
      await api.post("/api/adoptions", formData);

      toast.success("Adoption request submitted 🐾");
      setGovtId("");
      setGovtIdPhoto(null);
    } catch (err) {
      console.error("Adoption error 👉", err);

      // ✅ Backend responded (409 / 400 etc.)
      if (err.response) {
        const message =
          err.response.data?.message ||
          err.response.data ||
          "You have already requested adoption for this animal";

        toast.error(message);
      }
      // ❌ Backend unreachable
      else {
        toast.error("Server is not reachable. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <FaPaw className="text-green-600 text-4xl mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-gray-800">
            Adoption Application
          </h2>
          <p className="text-gray-600 mt-2">
            Your journey to giving a loving home starts here 💚
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Govt ID */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Government ID Number
            </label>
            <div className="relative">
              <FaIdCard className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                value={govtId}
                onChange={(e) => setGovtId(e.target.value)}
                placeholder="Enter your government ID"
                className="w-full pl-10 pr-4 py-2 border rounded-lg
                           focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Govt ID Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Upload Government ID Photo
            </label>

            <label className="flex items-center justify-center gap-3 w-full px-4 py-3
                              border-2 border-dashed rounded-lg cursor-pointer
                              hover:border-green-500 transition">
              <FaUpload className="text-green-600" />
              <span className="text-gray-600">
                {govtIdPhoto ? govtIdPhoto.name : "Choose file"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setGovtIdPhoto(e.target.files[0])}
              />
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-green-600 text-white font-semibold
              py-3 rounded-lg shadow-md
              hover:bg-green-700 hover:shadow-lg
              active:scale-95
              transition-all duration-200
              disabled:opacity-60
            "
          >
            {loading ? "Submitting..." : "Submit Adoption Request"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6 italic">
          “Saving one animal won’t change the world — but it will change the world for that one animal.”
        </p>
      </div>
    </div>
  );
};

export default ApplyAdoption;
