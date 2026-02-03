import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "../../services/api";


const DonateHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/payments/my-donations")
      .then((res) => setDonations(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading donation history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          My Donation History 📜
        </h1>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No donations made yet
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr key={d.id} className="border-t">
                    <td className="p-4 text-sm">{d.transactionId}</td>
                    <td className="p-4 font-semibold text-green-600">
                      ₹ {d.amount}
                    </td>
                    <td className="p-4">
                      {d.status === "SUCCESS" ? (
                        <span className="flex items-center gap-2 text-green-600 font-semibold">
                          <FaCheckCircle /> SUCCESS
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-500 font-semibold">
                          <FaTimesCircle /> FAILED
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(d.paymentDate).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {donations.length === 0 && (
            <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
              No donations made yet
            </div>
          )}

          {donations.map((d) => (
            <div
              key={d.id}
              className="bg-white p-5 rounded-xl shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">
                  ₹ {d.amount}
                </span>
                {d.status === "SUCCESS" ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    <FaCheckCircle /> SUCCESS
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500 text-sm font-semibold">
                    <FaTimesCircle /> FAILED
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600">
                <strong>Txn:</strong> {d.transactionId}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(d.paymentDate).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonateHistory;
