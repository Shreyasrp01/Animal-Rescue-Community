import { useEffect, useState } from "react";
import {
  getAllAnimals,
  deleteAnimal,
  updateAnimalStatus,
} from "../../services/adminAnimalService";
import {
  FaTrash,
  FaPaw,
  FaHeartbeat,
  FaHome,
  FaDog,
  FaCat,
  FaHorse,
  FaDove,
  FaSearch,
  FaFilter,
  FaSync,
  FaExclamationTriangle,
  FaStethoscope,
  FaCheckCircle,
  FaUserCheck,
  FaImage
} from "react-icons/fa";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast"; // This was missing

const STATUS_OPTIONS = [
  "REPORTED",
  "RESCUED",
  "UNDER_TREATMENT",
  "AVAILABLE",
  "ADOPTED",
];

const BASE_IMAGE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const loadAnimals = async () => {
    setIsLoading(true);
    try {
      const res = await getAllAnimals();
      setAnimals(res.data);
    } catch (error) {
      console.error("Error loading animals:", error);
      toast.error("Failed to load animals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  /* ---------- STATUS CHANGE WITH CONFIRM ---------- */
  const onStatusSelect = async (id, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return;

    const confirm = window.confirm(
      `Change status from "${currentStatus.replace(
        "_",
        " "
      )}" to "${newStatus.replace("_", " ")}"?`
    );

    if (!confirm) {
      loadAnimals(); // revert dropdown
      return;
    }

    try {
      setLoadingId(id);
      await updateAnimalStatus(id, newStatus);
      toast.success("Animal status updated successfully!");
      loadAnimals();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id, animalName) => {
    if (!window.confirm(`Are you sure you want to delete "${animalName}"?`)) return;
    try {
      await deleteAnimal(id);
      toast.success("Animal deleted successfully!");
      loadAnimals();
    } catch (error) {
      console.error("Error deleting animal:", error);
      toast.error("Failed to delete animal");
    }
  };

  // Filter animals
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || animal.status === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || animal.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Statistics
  const stats = {
    total: animals.length,
    reported: animals.filter(a => a.status === "REPORTED").length,
    rescued: animals.filter(a => a.status === "RESCUED").length,
    treatment: animals.filter(a => a.status === "UNDER_TREATMENT").length,
    available: animals.filter(a => a.status === "AVAILABLE").length,
    adopted: animals.filter(a => a.status === "ADOPTED").length,
  };

  // Get unique categories
  const categories = ["ALL", ...new Set(animals.map(a => a.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <FaPaw className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Manage Animals</h1>
                  <p className="text-gray-600 mt-1">Track and manage animal rescue lifecycle</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={loadAnimals}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaSync className="h-4 w-4" />
                <span className="font-medium">Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 shadow-sm">
              <div className="text-center">
                <p className="text-sm font-medium text-yellow-700 mb-1">Reported</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.reported}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-700 mb-1">Rescued</p>
                <p className="text-2xl font-bold text-blue-800">{stats.rescued}</p>
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 shadow-sm">
              <div className="text-center">
                <p className="text-sm font-medium text-orange-700 mb-1">Treatment</p>
                <p className="text-2xl font-bold text-orange-800">{stats.treatment}</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm">
              <div className="text-center">
                <p className="text-sm font-medium text-green-700 mb-1">Available</p>
                <p className="text-2xl font-bold text-green-800">{stats.available}</p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-sm">
              <div className="text-center">
                <p className="text-sm font-medium text-purple-700 mb-1">Adopted</p>
                <p className="text-2xl font-bold text-purple-800">{stats.adopted}</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                    <span>Search Animals</span>
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, breed, or category..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FaFilter className="h-4 w-4 text-gray-400" />
                    <span>Filter by Status</span>
                  </div>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="col-span-3 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="REPORTED">Reported</option>
                    <option value="RESCUED">Rescued</option>
                    <option value="UNDER_TREATMENT">Under Treatment</option>
                    <option value="AVAILABLE">Available</option>
                    <option value="ADOPTED">Adopted</option>
                  </select>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="col-span-3 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="ALL">All Categories</option>
                    {categories.filter(cat => cat !== "ALL").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredAnimals.length}</span> of <span className="font-bold text-gray-900">{animals.length}</span> animals
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("ALL");
                    setCategoryFilter("ALL");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animals Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-white border-b">
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Animal
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Change Status
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Category & Details
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAnimals.map((a) => (
                      <tr 
                        key={a.id} 
                        className="hover:bg-gray-50 transition-all duration-200 group"
                      >
                        {/* Animal Info */}
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-gray-200">
                                <img
                                  src={
                                    a.photo
                                      ? `${BASE_IMAGE_URL}/${a.photo}`
                                      : "https://cdn-icons-png.flaticon.com/512/616/616408.png"
                                  }
                                  alt={a.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) =>
                                    (e.target.src =
                                      "https://cdn-icons-png.flaticon.com/512/616/616408.png")
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{a.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Breed: <span className="font-medium">{a.breed || "Unknown"}</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Age: {a.age || "Unknown"} • ID: {a.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            <div className={`h-3 w-3 rounded-full ${getStatusDotColor(a.status)}`}></div>
                            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(a.status)}`}>
                              {getStatusIcon(a.status)}
                              <span className="ml-2">{a.status.replace("_", " ")}</span>
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Last updated: {new Date().toLocaleDateString()}
                          </p>
                        </td>

                        {/* Change Status */}
                        <td className="px-8 py-6">
                          <div className="relative">
                            <select
                              value={a.status}
                              onChange={(e) =>
                                onStatusSelect(
                                  a.id,
                                  e.target.value,
                                  a.status
                                )
                              }
                              disabled={loadingId === a.id}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none bg-white"
                            >
                              {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {status.replace("_", " ")}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              {loadingId === a.id ? (
                                <Loader size="small" />
                              ) : (
                                <FaSync className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Select to update status
                          </p>
                        </td>

                        {/* Category & Details */}
                        <td className="px-8 py-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(a.category)}
                              <span className="font-medium text-gray-900">{a.category}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p className="flex items-center space-x-2">
                                <span>Gender: {a.gender || "Unknown"}</span>
                                {a.vaccinated && (
                                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                    Vaccinated
                                  </span>
                                )}
                              </p>
                              {a.location && (
                                <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                  Location: {a.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleDelete(a.id, a.name)}
                              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 hover:shadow-sm transition-all duration-200 group"
                            >
                              <FaTrash className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              <span className="font-medium">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredAnimals.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <FaPaw className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              No animals found
                            </h3>
                            <p className="text-gray-600 max-w-md">
                              {searchTerm || statusFilter !== "ALL" || categoryFilter !== "ALL"
                                ? "Try adjusting your search or filter criteria"
                                : "No animals in the system yet"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              {filteredAnimals.length > 0 && (
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="text-sm text-gray-600 mb-2 md:mb-0">
                      Showing <span className="font-semibold">{filteredAnimals.length}</span> animals
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        Need to manage adoption applications? <button className="text-blue-600 hover:text-blue-700 font-medium">View applications</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Status Legend */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { status: "REPORTED", icon: FaExclamationTriangle, desc: "Animal has been reported" },
              { status: "RESCUED", icon: FaPaw, desc: "Animal rescued by team" },
              { status: "UNDER_TREATMENT", icon: FaHeartbeat, desc: "Receiving medical care" },
              { status: "AVAILABLE", icon: FaHome, desc: "Ready for adoption" },
              { status: "ADOPTED", icon: FaUserCheck, desc: "Successfully adopted" },
            ].map((item) => (
              <div key={item.status} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className={`h-10 w-10 rounded-lg ${getStatusBgColor(item.status)} flex items-center justify-center`}>
                  <item.icon className={`h-5 w-5 ${getStatusIconColor(item.status)}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.status.replace("_", " ")}</p>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- STATUS COLORS & ICONS ---------- */
const getStatusColor = (status) => {
  switch (status) {
    case "REPORTED":
      return "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200";
    case "RESCUED":
      return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200";
    case "UNDER_TREATMENT":
      return "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border border-orange-200";
    case "AVAILABLE":
      return "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200";
    case "ADOPTED":
      return "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200";
    default:
      return "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200";
  }
};

const getStatusDotColor = (status) => {
  switch (status) {
    case "REPORTED": return "bg-yellow-500";
    case "RESCUED": return "bg-blue-500";
    case "UNDER_TREATMENT": return "bg-orange-500";
    case "AVAILABLE": return "bg-green-500";
    case "ADOPTED": return "bg-purple-500";
    default: return "bg-gray-500";
  }
};

const getStatusBgColor = (status) => {
  switch (status) {
    case "REPORTED": return "bg-yellow-100";
    case "RESCUED": return "bg-blue-100";
    case "UNDER_TREATMENT": return "bg-orange-100";
    case "AVAILABLE": return "bg-green-100";
    case "ADOPTED": return "bg-purple-100";
    default: return "bg-gray-100";
  }
};

const getStatusIconColor = (status) => {
  switch (status) {
    case "REPORTED": return "text-yellow-600";
    case "RESCUED": return "text-blue-600";
    case "UNDER_TREATMENT": return "text-orange-600";
    case "AVAILABLE": return "text-green-600";
    case "ADOPTED": return "text-purple-600";
    default: return "text-gray-600";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "REPORTED":
      return <FaExclamationTriangle className="inline h-4 w-4" />;
    case "RESCUED":
      return <FaPaw className="inline h-4 w-4" />;
    case "UNDER_TREATMENT":
      return <FaHeartbeat className="inline h-4 w-4" />;
    case "AVAILABLE":
      return <FaHome className="inline h-4 w-4" />;
    case "ADOPTED":
      return <FaCheckCircle className="inline h-4 w-4" />;
    default:
      return <FaPaw className="inline h-4 w-4" />;
  }
};

const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || "";
  if (cat.includes("dog")) return <FaDog className="h-5 w-5 text-orange-500" />;
  if (cat.includes("cat")) return <FaCat className="h-5 w-5 text-purple-500" />;
  if (cat.includes("bird")) return <FaDove className="h-5 w-5 text-blue-500" />;
  if (cat.includes("rabbit") || cat.includes("horse")) return <FaHorse className="h-5 w-5 text-green-500" />;
  return <FaPaw className="h-5 w-5 text-gray-500" />;
};

export default ManageAnimals;