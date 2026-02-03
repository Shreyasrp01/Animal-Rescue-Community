import { FaPaw, FaFacebook, FaTwitter, FaInstagram, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Quick Links": [
      { name: "Home", path: "/" },
      { name: "Animals", path: "/animals" },
      { name: "About Us", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
    Services: [
      { name: "Adoption", path: "/animals" },
      { name: "Donate", path: "/donor/donate" },
      { name: "Volunteer", path: "/contact" },
    ],
    Legal: [
      { name: "Privacy Policy", path: "/" },
      { name: "Terms of Service", path: "/" },
      { name: "FAQ", path: "/" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <FaPaw className="text-green-400 text-3xl" />
              <span className="text-2xl font-bold">
                Animal<span className="text-green-400">Rescue</span>
              </span>
            </Link>

            <p className="text-gray-400 mb-6">
              Giving abandoned animals a second chance through rescue,
              rehabilitation, and adoption.
            </p>

            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram size={22} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-lg font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-green-400"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h4 className="font-semibold mb-1">Location</h4>
            <p className="text-gray-400">123 Rescue Street, Animal City</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Email</h4>
            <p className="text-gray-400">help@animalrescue.org</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Emergency Hotline</h4>
            <p className="text-green-400 font-bold">1-800-RESCUE-PET</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-400">
            © {currentYear} Animal Rescue. All rights reserved.
          </p>
          <div className="flex items-center gap-1 mt-2 md:mt-0">
            <span className="text-gray-400">Made with</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span className="text-gray-400">for animals</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
