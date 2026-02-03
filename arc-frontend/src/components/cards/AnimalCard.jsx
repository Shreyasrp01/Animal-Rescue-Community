import {
  FaPaw,
  FaHeart,
  FaVenusMars,
  FaBirthdayCake,
  FaHome,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AnimalCard = ({ animal }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:-translate-y-2 transition-transform">
      
      {/* Image */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />

        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              animal.status === "Available"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {animal.status}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {animal.name}
            </h3>
            <p className="text-gray-600">{animal.breed}</p>
          </div>

          <div className="bg-green-100 p-2 rounded-lg">
            <FaPaw className="text-green-600" />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FaVenusMars className="text-gray-400" />
            <span>{animal.type}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaBirthdayCake className="text-gray-400" />
            <span>{animal.age}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm">
          {animal.description ||
            "Loving and friendly companion looking for a forever home."}
        </p>

        {/* Actions */}
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <button className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
              <FaHeart />
              <span>Save</span>
            </button>

            <Link
              to={`/animals/${animal.id}`}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
            >
              <FaHome />
              <span>Adopt</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
