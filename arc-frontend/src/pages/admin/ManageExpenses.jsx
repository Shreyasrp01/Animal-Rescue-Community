import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaTrash, 
  FaCalendarAlt, 
  FaUser, 
  FaRupeeSign,
  FaEye,
  FaPlus,
  FaSearch,
  FaSync,
  FaFileAlt,
  FaFileInvoice,
  FaMoneyBillWave,
  FaTimes
} from "react-icons/fa";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8080/api/expenses";
const BASE_URL = "http://localhost:8080";

const ManageExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proof, setProof] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [form, setForm] = useState({
    amount: "",
    paidTo: "",
    description: "",
    expenseDate: "",
  });

  const token = localStorage.getItem("token");

  /* ---------- LOAD EXPENSES ---------- */
  const loadExpenses = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API DATA 👉", res.data);
      setExpenses(res.data);
    } catch (err) {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  /* ---------- ADD EXPENSE ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      amount: form.amount,
      paidTo: form.paidTo,
      description: form.description,
      expenseDate: form.expenseDate,
    };

    const fd = new FormData();
    fd.append(
      "expense",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );

    if (proof) fd.append("proof", proof);

    try {
      await axios.post(API_URL, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Expense added successfully");
      setForm({ amount: "", paidTo: "", description: "", expenseDate: "" });
      setProof(null);
      loadExpenses();
    } catch {
      toast.error("Failed to add expense");
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadExpenses();
  };

  /* ---------- GET PROOF URL ---------- */
  const getProofUrl = (path) => {
    if (!path || path === "NULL") return null;
    return `${BASE_URL}/${path}`;
  };

  /* ---------- VIEW IMAGE ---------- */
  const viewImage = (path) => {
    const imageUrl = getProofUrl(path);
    if (!imageUrl) {
      toast.error("No image available");
      return;
    }
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  /* ---------- FILTER EXPENSES ---------- */
  const filteredExpenses = expenses.filter((e) =>
    e.paidTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------- FORMAT DATE ---------- */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl shadow-2xl">
                <FaMoneyBillWave className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
                Manage Expenses
              </h1>
              <p className="text-gray-600 mt-2">Track and manage all organizational expenses</p>
            </div>
          </div>

          <button
            onClick={loadExpenses}
            className="group flex items-center space-x-3 px-5 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
          >
            <FaSync className="text-blue-600 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-medium text-gray-700">Refresh Data</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="relative overflow-hidden group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaFileInvoice className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{expenses.length}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-xs text-gray-400 mt-2">All recorded expenses</p>
            </div>
          </div>

          <div className="relative overflow-hidden group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <FaSearch className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{filteredExpenses.length}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">Filtered Expenses</p>
              <p className="text-xs text-gray-400 mt-2">Current search results</p>
            </div>
          </div>

          <div className="relative overflow-hidden group bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full opacity-70 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaRupeeSign className="h-6 w-6 text-white" />
                </div>
                <span className="text-3xl font-bold text-white">
                  ₹ {filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
                </span>
              </div>
              <p className="text-sm font-medium text-white/90">Total Amount</p>
              <p className="text-xs text-white/70 mt-2">Sum of filtered expenses</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Expense Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg">
                  <FaPlus className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Add New Expense</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaRupeeSign className="inline mr-2 text-gray-400" />
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>

                {/* Date Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-gray-400" />
                    Date *
                  </label>
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    value={form.expenseDate}
                    onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                    required
                  />
                </div>

                {/* Paid To Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-gray-400" />
                    Paid To *
                  </label>
                  <input
                    type="text"
                    placeholder="Recipient name"
                    className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    value={form.paidTo}
                    onChange={(e) => setForm({ ...form, paidTo: e.target.value })}
                    required
                  />
                </div>

                {/* Proof Upload Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaFileAlt className="inline mr-2 text-gray-400" />
                    Upload Proof (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-blue-400 transition-colors duration-200">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                      className="w-full"
                      onChange={(e) => setProof(e.target.files[0])}
                    />
                    {proof && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {proof.name}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, GIF, BMP, WEBP (Max: 5MB)
                  </p>
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Enter expense details..."
                    className="w-full border-2 border-gray-200 rounded-xl p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none h-32"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Save Expense
                </button>
              </form>
            </div>
          </div>

          {/* Expenses List */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by recipient or description..."
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {filteredExpenses.length} expenses found
                </div>
              </div>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                  <div className="relative">
                    <div className="h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaMoneyBillWave className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">Loading expenses...</p>
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                  <div className="p-6 bg-gray-100 rounded-2xl mb-4">
                    <FaFileInvoice className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No expenses found</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first expense'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt /> Date
                          </div>
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <FaUser /> Paid To
                          </div>
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center gap-2">
                            <FaRupeeSign /> Amount
                          </div>
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Proof
                        </th>
                        <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredExpenses.map((e) => {
                        const proofUrl = getProofUrl(e.expenseProof);
                        const hasProof = proofUrl !== null;
                        
                        return (
                          <tr 
                            key={e.id} 
                            className="hover:bg-blue-50/30 transition-colors duration-150 group"
                          >
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <FaCalendarAlt className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{formatDate(e.expenseDate)}</p>
                                  <p className="text-xs text-gray-500">{e.expenseDate}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-5 px-6">
                              <p className="font-medium text-gray-900">{e.paidTo}</p>
                            </td>
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-2">
                                <span className="p-2 bg-emerald-100 rounded-lg">
                                  <FaRupeeSign className="h-4 w-4 text-emerald-600" />
                                </span>
                                <span className="font-bold text-lg text-gray-900">
                                  ₹ {parseFloat(e.amount).toFixed(2)}
                                </span>
                              </div>
                            </td>
                            <td className="py-5 px-6">
                              <p className="text-gray-700">{e.description}</p>
                            </td>
                            <td className="py-5 px-6 text-center">
                              {hasProof ? (
                                <button
                                  onClick={() => viewImage(e.expenseProof)}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all duration-200 group/view"
                                >
                                  <FaEye className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium">View</span>
                                </button>
                              ) : (
                                <div className="text-gray-400 text-sm">
                                  <FaFileAlt className="h-8 w-8 mx-auto mb-1 opacity-50" />
                                  No proof
                                </div>
                              )}
                            </td>
                            <td className="py-5 px-6 text-center">
                              <button
                                onClick={() => handleDelete(e.id)}
                                className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:shadow-md transition-all duration-200 group/delete"
                                title="Delete Expense"
                              >
                                <FaTrash className="h-5 w-5 group-hover/delete:scale-110 transition-transform" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                        <td colSpan="6" className="py-4 px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Showing <span className="font-semibold">{filteredExpenses.length}</span> expenses
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                              Total: <span className="text-emerald-600">
                                ₹ {filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image View Modal */}
      {showImageModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setShowImageModal(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-6xl w-full">
              {/* Close Button */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-12 right-0 p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors z-10"
              >
                <FaTimes className="h-6 w-6" />
              </button>
              
              {/* Image Container */}
              <div className="relative bg-black rounded-xl overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Expense Proof" 
                  className="max-h-[85vh] w-auto mx-auto"
                />
                
                {/* Download Button */}
                <div className="absolute bottom-4 right-4">
                  <a 
                    href={selectedImage} 
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg hover:bg-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageExpenses;