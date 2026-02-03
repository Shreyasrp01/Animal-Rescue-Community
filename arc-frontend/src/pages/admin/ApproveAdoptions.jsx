import { useEffect, useState } from "react";
import {
  getAllAdoptions,
  updateAdoptionStatus,
} from "../../services/adminAdoptionService";
import {
  FaHeart,
  FaSearch,
  FaFilter,
  FaSync,
  FaClipboardCheck,
  FaEnvelope,
  FaPhone,
  FaUserCircle,
  FaIdCard,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaFingerprint,
  FaExternalLinkAlt,
  FaDog,
  FaCat,
  FaPaw
} from "react-icons/fa";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];
const BASE_IMAGE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const ApprovedAdoptions = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [animalFilter, setAnimalFilter] = useState("ALL");
  const [showIdModal, setShowIdModal] = useState(false);
  const [selectedIdImage, setSelectedIdImage] = useState("");

  const loadAdoptions = async () => {
    setIsLoading(true);
    try {
      const res = await getAllAdoptions();
      setAdoptions(res.data);
    } catch {
      toast.error("Failed to load adoption requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdoptions();
  }, []);

  const handleStatusChange = async (id, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return;

    if (!window.confirm(`Change status from ${currentStatus} to ${newStatus}?`))
      return;

    try {
      setLoadingId(id);
      await updateAdoptionStatus(id, newStatus);
      toast.success("Adoption status updated");
      loadAdoptions();
    } catch {
      toast.error("Status update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredAdoptions = adoptions.filter((a) => {
    const search =
      a.animalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.govtId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id?.toString().includes(searchTerm);

    const statusOk = statusFilter === "ALL" || a.status === statusFilter;
    const animalOk =
      animalFilter === "ALL" || a.animalName === animalFilter;

    return search && statusOk && animalOk;
  });

  const getImageUrl = (path) =>
    path?.startsWith("http") ? path : `${BASE_IMAGE_URL}/${path}`;

  const getAnimalImageUrl = (photo) => {
    if (!photo) return null;
    return photo.startsWith("http") ? photo : `${BASE_IMAGE_URL}/${photo}`;
  };

  const getAnimalIcon = (animalName) => {
    if (!animalName) return <FaPaw className="h-8 w-8 text-gray-400" />;
    const name = animalName.toLowerCase();
    if (name.includes("dog")) return <FaDog className="h-8 w-8 text-orange-500" />;
    if (name.includes("cat")) return <FaCat className="h-8 w-8 text-purple-500" />;
    return <FaPaw className="h-8 w-8 text-gray-500" />;
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const viewIdImage = (img) => {
    if (!img) return toast.error("ID image not available");
    setSelectedIdImage(getImageUrl(img));
    setShowIdModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl shadow-lg">
                <FaHeart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Approved Adoptions</h1>
                <p className="text-gray-600 mt-1">Review and manage adoption applications</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={loadAdoptions}
            className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
          >
            <FaSync className="text-blue-600" />
            <span className="font-medium">Refresh</span>
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                  <span>Search</span>
                </div>
              </label>
              <input
                type="text"
                placeholder="Search by animal, customer, or ID..."
                className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FaFilter className="h-4 w-4 text-gray-400" />
                  <span>Status</span>
                </div>
              </label>
              <select
                className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Animal
              </label>
              <select
                className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
                value={animalFilter}
                onChange={(e) => setAnimalFilter(e.target.value)}
              >
                <option value="ALL">All Animals</option>
                {[...new Set(adoptions.map((a) => a.animalName).filter(Boolean))].map(
                  (n) => n && <option key={n} value={n}>{n}</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative">
                <div className="h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaHeart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="mt-4 text-gray-600 font-medium">Loading adoptions...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Animal</th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Govt ID</th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">ID Proof</th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAdoptions.map((a) => {
                      const animalImageUrl = getAnimalImageUrl(a.animalPhoto);
                      return (
                        <tr key={a.id} className="hover:bg-gray-50 transition-all duration-200">
                          {/* ANIMAL COLUMN WITH IMAGE */}
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                {animalImageUrl ? (
                                  <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-gray-200">
                                    <img
                                      src={animalImageUrl}
                                      alt={a.animalName}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `
                                          <div class="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center">
                                            ${a.animalName ? getAnimalIcon(a.animalName).props.children : ''}
                                          </div>
                                        `;
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center">
                                    {getAnimalIcon(a.animalName)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-lg">{a.animalName}</p>
                                {a.animalCategory && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {a.animalCategory}
                                  </p>
                                )}
                                {a.animalAge && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Age: {a.animalAge}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* CUSTOMER */}
                          <td className="px-8 py-5">
                            <div className="flex items-start gap-3">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                                <FaUserCircle className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{a.customerName}</p>
                                {a.customerEmail && (
                                  <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                                    <FaEnvelope className="h-3 w-3" /> 
                                    <span className="truncate max-w-[200px]">{a.customerEmail}</span>
                                  </p>
                                )}
                                {a.customerPhone && (
                                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                    <FaPhone className="h-3 w-3" /> {a.customerPhone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* GOVT ID */}
                          <td className="px-8 py-5">
                            {a.govtId && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FaFingerprint className="h-4 w-4 text-blue-500" />
                                  <p className="font-mono font-semibold text-gray-900">{a.govtId}</p>
                                </div>
                                {a.govtIdType && (
                                  <p className="text-sm text-gray-600">
                                    Type: {a.govtIdType}
                                  </p>
                                )}
                              </div>
                            )}
                          </td>

                          {/* ID PROOF */}
                          <td className="px-8 py-5">
                            {a.govtIdPhoto && (
                              <div className="space-y-2">
                                <button
                                  onClick={() => viewIdImage(a.govtIdPhoto)}
                                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  <FaEye /> View ID Proof
                                </button>
                                <p className="text-xs text-gray-500">
                                  Click to view document
                                </p>
                              </div>
                            )}
                          </td>

                          {/* STATUS */}
                          <td className="px-8 py-5">
                            <span
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(
                                a.status
                              )}`}
                            >
                              {a.status === "APPROVED" && <FaCheckCircle />}
                              {a.status === "PENDING" && <FaHourglassHalf />}
                              {a.status === "REJECTED" && <FaTimesCircle />}
                              {a.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatDate(a.updatedAt || a.createdAt)}
                            </p>
                          </td>

                          {/* CHANGE STATUS */}
                          <td className="px-8 py-5">
                            <div className="relative">
                              <select
                                value={a.status}
                                disabled={loadingId === a.id}
                                onChange={(e) =>
                                  handleStatusChange(a.id, e.target.value, a.status)
                                }
                                className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
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
                          </td>
                        </tr>
                      );
                    })}

                    {filteredAdoptions.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <FaClipboardCheck className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              No adoption requests found
                            </h3>
                            <p className="text-gray-600 max-w-md">
                              {searchTerm || statusFilter !== "ALL" || animalFilter !== "ALL"
                                ? "Try adjusting your search or filter criteria"
                                : "No adoption requests have been submitted yet"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* TABLE FOOTER */}
              {filteredAdoptions.length > 0 && (
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{filteredAdoptions.length}</span> adoption requests
                    </div>
                    <div className="text-sm text-gray-600">
                      Total: {adoptions.length} • 
                      <span className="text-yellow-600 font-semibold ml-2">
                        {adoptions.filter(a => a.status === "PENDING").length} Pending
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ID MODAL */}
        {showIdModal && (
          <>
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setShowIdModal(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full transform transition-all animate-fadeIn">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FaIdCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl text-gray-900">Government ID Proof</h2>
                      <p className="text-sm text-gray-500">Customer identification document</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowIdModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center p-4">
                    <img
                      src={selectedIdImage}
                      alt="Government ID"
                      className="max-h-[70vh] max-w-full rounded-lg shadow-lg"
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Click outside or press ESC to close
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={selectedIdImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FaExternalLinkAlt /> Open in new tab
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ApprovedAdoptions;