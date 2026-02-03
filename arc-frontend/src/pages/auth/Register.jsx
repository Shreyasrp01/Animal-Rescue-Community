import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPaw,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { registerUser } from "../../services/authService";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        role: formData.role, // CUSTOMER / DONOR
      });

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-md p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaPaw className="text-green-600 text-4xl" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join our mission to help animals
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              icon={<FaUser />}
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              icon={<FaEnvelope />}
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              icon={<FaPhone />}
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              icon={<FaMapMarkerAlt />}
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

            <Input
              icon={<FaLock />}
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <Input
              icon={<FaLock />}
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <RoleButton
                  active={formData.role === "CUSTOMER"}
                  onClick={() =>
                    setFormData({ ...formData, role: "CUSTOMER" })
                  }
                  title="Adopt Animals"
                  desc="Find and adopt pets"
                />
                <RoleButton
                  active={formData.role === "DONOR"}
                  onClick={() =>
                    setFormData({ ...formData, role: "DONOR" })
                  }
                  title="Donate"
                  desc="Support our mission"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-green-600 font-semibold">
                Sign in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;

/* ---------- Helpers ---------- */

const Input = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        {icon}
      </span>
      <input
        {...props}
        required
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
      />
    </div>
  </div>
);

const RoleButton = ({ active, title, desc, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 rounded-lg border-2 text-left ${
      active
        ? "border-green-600 bg-green-50"
        : "border-gray-300 hover:border-green-400"
    }`}
  >
    <div className="font-semibold">{title}</div>
    <div className="text-sm text-gray-600">{desc}</div>
  </button>
);
