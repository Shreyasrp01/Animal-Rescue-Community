import { Link, Navigate } from "react-router-dom";
import {
  FaPaw,
  FaHeart,
  FaHandHoldingUsd,
  FaHome,
  FaShieldAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";


const Home = () => {
  const { user, isAuthenticated } = useAuth();

  // 🔐 Redirect logged-in users to their dashboard
  if (isAuthenticated && user?.role === "CUSTOMER") {
    return <Navigate to="/customer/dashboard" replace />;
  }

  if (isAuthenticated && user?.role === "DONOR") {
    return <Navigate to="/donor/dashboard" replace />;
  }

  const stats = [
    { number: "500+", label: "Animals Rescued", icon: FaPaw },
    { number: "300+", label: "Successful Adoptions", icon: FaHeart },
    { number: "$50k+", label: "Donations Raised", icon: FaHandHoldingUsd },
    { number: "200+", label: "Happy Families", icon: FaHome },
  ];

  const services = [
    {
      icon: FaPaw,
      title: "Adopt an Animal",
      description: "Give a rescued animal a loving forever home.",
      bg: "bg-green-100",
      text: "text-green-600",
    },
    {
      icon: FaHeart,
      title: "Rescue & Care",
      description: "Help us rescue and rehabilitate injured animals.",
      bg: "bg-red-100",
      text: "text-red-600",
    },
    {
      icon: FaHandHoldingUsd,
      title: "Donate",
      description: "Support medical care, food, and shelter.",
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      icon: FaShieldAlt,
      title: "Volunteer",
      description: "Join our community and make a difference.",
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <FaPaw className="mx-auto text-6xl mb-6" />
          <h1 className="text-5xl font-bold mb-6">
            Animal Rescue Community
          </h1>
          <p className="text-lg mb-8 text-gray-100 max-w-2xl mx-auto">
            We rescue, rehabilitate, and rehome abandoned animals.
            Together, we give them a second chance at life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-700 hover:bg-green-800 px-8 py-3 rounded-lg font-semibold"
            >
              Join Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="w-16 h-16 mx-auto bg-white rounded-full shadow flex items-center justify-center mb-4">
                <stat.icon className="text-green-600 text-2xl" />
              </div>
              <div className="text-3xl font-bold">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How You Can Help */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            How You Can Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow hover:-translate-y-1 transition"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${service.bg}`}
                >
                  <service.icon className={`${service.text} text-xl`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Be a Part of the Change
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-100">
          Adopt, donate, or volunteer — every action saves lives.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold"
          >
            Become a Member
          </Link>
          <Link
            to="/login"
            className="bg-green-800 px-8 py-3 rounded-lg font-semibold"
          >
            Login
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
