import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
// import API from "../../services/api";
import { reportAnimal } from "../../services/animalService";
import {
  FaPaw,
  FaCamera,
  FaMapMarkerAlt,
  FaVenusMars,
  FaArrowLeft,
  FaHeartbeat,
} from "react-icons/fa";
import Loader from "../../components/common/Loader";

const ReportAnimal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const [animal, setAnimal] = useState({
    name: "",
    category: "",
    breed: "",
    age: "",
    gender: "",
    vaccinated: false,
    dewormed: false,
    location: "",
    description: "",
    status: "REPORTED",
  });

  /* ---------------- handlers ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnimal((prev) => ({ ...prev, [name]: value }));
  };

  const setBoolean = (field, value) => {
    setAnimal((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  /* 📍 Location API (optional) */
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setAnimal((prev) => ({
          ...prev,
          location: `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)}`,
        }));
        toast.success("Current location added 📍");
      },
      () => toast.error("Location permission denied")
    );
  };

  /* ---------------- submit ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("animal", JSON.stringify(animal));
      if (photo) formData.append("photo", photo);

      await reportAnimal(formData);
      toast.success("Animal reported successfully 🐾");
      navigate("/customer/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to report animal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back */}
        <Link
          to="/customer/dashboard"
          className="inline-flex items-center gap-2 text-green-600 mb-6 font-medium"
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white flex items-center gap-4">
            <FaPaw className="text-4xl opacity-90" />
            <div>
              <h1 className="text-2xl font-bold">Report an Animal</h1>
              <p className="text-green-100 text-sm">
                Provide clear details to help rescue faster
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Photo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Animal Photo (optional)
              </label>
              <div className="flex gap-6 items-center">
                <div className="w-32 h-32 border-2 border-dashed rounded-xl flex items-center justify-center bg-gray-50">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <FaCamera className="text-3xl text-gray-400" />
                  )}
                </div>

                <label className="cursor-pointer text-sm bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handlePhoto}
                  />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Animal Name"
                placeholder="e.g. Rocky"
                name="name"
                value={animal.name}
                onChange={handleChange}
                required
              />

              <Field
                label="Category"
                placeholder="Dog, Cat, Bird, Cow, etc."
                name="category"
                value={animal.category}
                onChange={handleChange}
                required
              />

              <Field
                label="Breed"
                placeholder="e.g. Labrador, Persian"
                name="breed"
                value={animal.breed}
                onChange={handleChange}
              />

              <Field
                label="Age (in years)"
                placeholder="e.g. 2.5"
                name="age"
                type="number"
                step="0.1"
                value={animal.age}
                onChange={handleChange}
                required
              />

              {/* Gender */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={animal.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              {/* Location */}
              <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>

                <div className="flex gap-3">
                  <input
                    name="location"
                    value={animal.location}
                    onChange={handleChange}
                    placeholder="Enter specific area, city, landmark"
                    required
                    className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={fetchLocation}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition whitespace-nowrap"
                  >
                    Use My Location
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  You can type a specific place or use your current location.
                </p>
              </div>
            </div>

            {/* Health */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Health Information
              </label>

              <div className="flex gap-6">
                <Toggle
                  label="Vaccinated"
                  value={animal.vaccinated}
                  onYes={() => setBoolean("vaccinated", true)}
                  onNo={() => setBoolean("vaccinated", false)}
                />
                <Toggle
                  label="Dewormed"
                  value={animal.dewormed}
                  onYes={() => setBoolean("dewormed", true)}
                  onNo={() => setBoolean("dewormed", false)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={animal.description}
                onChange={handleChange}
                placeholder="Describe the animal’s condition, behavior, injuries, etc."
                required
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg flex items-center gap-2 hover:scale-105 transition"
              >
                {loading ? <Loader /> : <FaHeartbeat />}
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportAnimal;

/* ---------- small components ---------- */

const Field = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
    />
  </div>
);

const Toggle = ({ label, value, onYes, onNo }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      type="button"
      onClick={onYes}
      className={`px-3 py-1 rounded-full border transition ${
        value ? "bg-green-500 text-white" : "bg-gray-100"
      }`}
    >
      Yes
    </button>
    <button
      type="button"
      onClick={onNo}
      className={`px-3 py-1 rounded-full border transition ${
        !value ? "bg-red-500 text-white" : "bg-gray-100"
      }`}
    >
      No
    </button>
  </div>
);
