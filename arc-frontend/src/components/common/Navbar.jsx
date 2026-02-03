import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPaw, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ---------------- ROLE BASED HOME PATH ---------------- */
  const homePath = !user
    ? "/" // GUEST → Guest Home.jsx
    : user.role === "ADMIN"
    ? "/admin/dashboard"
    : user.role === "CUSTOMER"
    ? "/customer/dashboard"
    : user.role === "DONOR"
    ? "/donor/dashboard"
    : "/";

  /* ---------------- NAV LINKS ---------------- */
  const navLinks = [
    { name: "Home", path: homePath },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link to={homePath} className="flex items-center gap-2">
            <FaPaw className="text-green-600 text-2xl" />
            <span className="text-xl font-bold text-gray-800">
              Animal<span className="text-green-600">Rescue</span>
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                {link.name}
              </Link>
            ))}

            {/* CUSTOMER ONLY */}
            {user?.role === "CUSTOMER" && (
              <Link
                to="/customer/animals"
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                Animals
              </Link>
            )}
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-700">
                  Hi, <b>{user.name}</b>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
                >
                  Logout
                </button>

                {/* DASHBOARD BUTTON */}
                <Link
                  to={homePath}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden py-4 border-t space-y-4">

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block text-gray-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* CUSTOMER ONLY */}
            {user?.role === "CUSTOMER" && (
              <Link
                to="/customer/animals"
                className="block text-gray-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Animals
              </Link>
            )}

            <div className="pt-4 border-t space-y-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUser />
                    {user.name}
                  </div>

                  <Link
                    to={homePath}
                    className="block text-center px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 border border-green-600 text-green-600 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-center px-4 py-2 border border-green-600 text-green-600 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-center px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
