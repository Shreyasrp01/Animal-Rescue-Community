import { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: FaPhone,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543 (Emergency)"],
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: ["info@animalrescue.org", "support@animalrescue.org"],
    },
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      details: ["123 Rescue Street", "Animal City, AC 12345"],
    },
    {
      icon: FaClock,
      title: "Hours",
      details: ["Mon-Fri: 9AM - 6PM", "Sat-Sun: 10AM - 4PM"],
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-100">
            Have questions? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((info, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow text-center hover:-translate-y-1 transition"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <info.icon className="text-green-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
              {info.details.map((d, idx) => (
                <p key={idx} className="text-gray-600 text-sm">
                  {d}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Form & Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="border p-3 rounded-md w-full"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="border p-3 rounded-md w-full"
                />
              </div>

              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="border p-3 rounded-md w-full"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Your Message"
                required
                className="border p-3 rounded-md w-full"
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-md flex items-center justify-center gap-2 hover:bg-green-700"
              >
                <FaPaperPlane />
                Send Message
              </button>
            </form>
          </div>

          {/* Map & Info */}
          <div>
            <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center mb-8">
              <div className="text-center">
                <FaMapMarkerAlt className="text-green-600 text-4xl mx-auto mb-2" />
                <p className="font-semibold">Our Location</p>
                <p className="text-gray-600">123 Rescue Street</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Emergency Animal Rescue
                </h3>
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-700 font-bold">
                    1-800-RESCUE-PET
                  </p>
                  <p className="text-red-600 text-sm">Available 24/7</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Volunteer Opportunities
                </h3>
                <button className="border border-green-600 text-green-600 px-4 py-2 rounded-md hover:bg-green-50">
                  Learn About Volunteering
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How can I adopt an animal?",
                a: "Browse animals online and apply.",
              },
              {
                q: "What are the adoption fees?",
                a: "Fees range from $50–$300.",
              },
              {
                q: "Can I donate supplies?",
                a: "Yes, we accept food and supplies.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-md shadow"
              >
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
