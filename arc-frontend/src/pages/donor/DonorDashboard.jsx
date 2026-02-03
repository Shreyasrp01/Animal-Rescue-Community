import {
  FaHandHoldingUsd,
  FaChartLine,
  FaHeart,
  FaPaw,
  FaClinicMedical,
  FaUtensils,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const DonorDashboard = () => {
  const { user } = useAuth();

  const actions = [
    {
      icon: FaHandHoldingUsd,
      title: "Make a Donation",
      desc: "Support rescue & medical care",
      link: "/donor/donate",
      color: "blue",
    },
    {
      icon: FaChartLine,
      title: "My Contributions",
      desc: "View your donation history",
      link: "/donor/history",
      color: "green",
    },
    {
      icon: FaHeart,
      title: "Impact Stories",
      desc: "See lives you’ve changed",
      link: "/donor/impact",
      color: "red",
    },
  ];

  const impacts = [
    { icon: FaClinicMedical, title: "Medical Care", value: "120+ Animals Treated" },
    { icon: FaUtensils, title: "Food Support", value: "8,000+ Meals Served" },
    { icon: FaPaw, title: "Rescues", value: "75+ Animals Saved" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ✅ Gradient Header (NEW) */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold"
          >
            Donor Dashboard 🐾
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-lg text-green-100 max-w-2xl"
          >
            Thank you, {user?.name}! Your generosity is changing lives every day.
          </motion.p>
        </div>

        {/* Decorative Paws */}
        <FaPaw className="absolute right-16 top-10 text-white/20 text-7xl" />
        <FaPaw className="absolute right-40 bottom-6 text-white/10 text-6xl" />
      </div>

      {/* Main Content */}
      <div className="px-4 py-12">
        <div className="max-w-7xl mx-auto">

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {actions.map((item, i) => (
              <motion.a
                key={i}
                href={item.link}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition"
              >
                <div
                  className={`w-14 h-14 rounded-full bg-${item.color}-100 flex items-center justify-center mb-4`}
                >
                  <item.icon className={`text-${item.color}-600 text-2xl`} />
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.a>
            ))}
          </div>

          {/* Impact Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Your Impact So Far 🐾
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {impacts.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow p-6 text-center"
                >
                  <item.icon className="text-4xl text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-600 mt-2">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual Impact Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-10 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-3">
                Every Donation Saves a Life ❤️
              </h2>
              <p className="max-w-xl text-gray-100">
                Donations help fund surgeries, vaccinations, shelter, food,
                and rehabilitation. Together, we create hope for the voiceless.
              </p>
            </div>

            <FaPaw className="absolute right-10 top-10 text-white/20 text-7xl" />
            <FaPaw className="absolute right-32 bottom-6 text-white/10 text-6xl" />
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
