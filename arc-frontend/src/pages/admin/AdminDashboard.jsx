import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPaw,
  FaUsers,
  FaCheckCircle,
  FaMoneyBillWave,
  FaShieldAlt,
  FaQuoteLeft,
  FaHandsHelping,
} from "react-icons/fa";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    animals: 0,
    adoptions: 0,
    users: 0,
    expenses: 0,
  });

  const loadStats = async () => {
    try {
      const [animals, adoptions, users, expenses] = await Promise.all([
        api.get("/api/animals"),
        api.get("/api/adoptions"),
        api.get("/api/admin/users"),
        api.get("/api/expenses"),
      ]);

      setStats({
        animals: animals.data.length,
        adoptions: adoptions.data.length,
        users: users.data.length,
        expenses: expenses.data.length,
      });
    } catch (err) {
      console.error("Failed to load admin stats");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4">
            <FaShieldAlt className="text-4xl" />
            <div>
              <h1 className="text-4xl font-bold">
                Admin Control Panel
              </h1>
              <p className="text-gray-200">
                Secure • Transparent • Responsible Management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUOTE (READ-ONLY INSPIRATION) */}
      <div className="max-w-5xl mx-auto px-6 mt-10">
        <div className="bg-white rounded-xl shadow p-6 text-center animate-slideUp">
          <FaQuoteLeft className="text-purple-600 text-2xl mx-auto mb-3" />
          <p className="text-lg text-gray-700 italic">
            “Administration is not about control — it’s about care, accountability,
            and compassion for every life.”
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6">
        <StatCard title="Animals Rescued" value={stats.animals} icon={<FaPaw />} color="text-green-600" />
        <StatCard title="Adoption Requests" value={stats.adoptions} icon={<FaCheckCircle />} color="text-blue-600" />
        <StatCard title="Registered Users" value={stats.users} icon={<FaUsers />} color="text-pink-600" />
        <StatCard title="Expenses Logged" value={stats.expenses} icon={<FaMoneyBillWave />} color="text-yellow-600" />
      </div>

      {/* READ-ONLY INFO SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid md:grid-cols-3 gap-6">
        <InfoCard
          icon={<FaHandsHelping />}
          title="Your Responsibility"
          text="Every approval, rejection, and update directly impacts an animal’s life. Act with empathy and accuracy."
        />
        <InfoCard
          icon={<FaPaw />}
          title="Transparency Matters"
          text="All actions are recorded to ensure accountability, trust, and ethical rescue operations."
        />
        <InfoCard
          icon={<FaShieldAlt />}
          title="System Integrity"
          text="Admin privileges must be used wisely to protect both people and animals in the ecosystem."
        />
      </div>

      {/* ACTIONS */}
      <div className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-2 gap-8">
        <AdminAction title="Manage Animals" link="/admin/manage-animals" />
        <AdminAction title="Approved Adoptions" link="/admin/approved-adoptions" />
        <AdminAction title="Manage Users" link="/admin/manage-users" />
        <AdminAction title="Manage Expenses" link="/admin/manage-expenses" />
      </div>

    </div>
  );
};

/* ---------- Small Components ---------- */

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:-translate-y-1 transition">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminAction = ({ title, link }) => (
  <Link
    to={link}
    className="bg-white rounded-xl shadow p-8 hover:-translate-y-1 transition flex justify-between items-center"
  >
    <h3 className="text-2xl font-bold">{title}</h3>
    <span className="text-purple-600 font-semibold">Open →</span>
  </Link>
);

const InfoCard = ({ icon, title, text }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center hover:-translate-y-1 transition">
    <div className="text-purple-600 text-3xl mb-3 mx-auto">
      {icon}
    </div>
    <h4 className="text-xl font-semibold mb-2">
      {title}
    </h4>
    <p className="text-gray-600">
      {text}
    </p>
  </div>
);

export default AdminDashboard;
