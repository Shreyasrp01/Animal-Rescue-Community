import { motion } from "framer-motion";
import { FaPaw, FaHeart } from "react-icons/fa";

const ImpactStories = () => {
  const stories = [
    {
      name: "Bruno 🐕",
      image:
        "https://images.unsplash.com/photo-1558788353-f76d92427f16",
      story:
        "Bruno was found injured on the roadside. Thanks to donor support, he received surgery and is now adopted into a loving home.",
    },
    {
      name: "Micky 🐈",
      image:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      story:
        "Misty was rescued during heavy rains. Donations helped with vaccinations and shelter care.",
    },
    {
      name: "Rocky 🐕",
      image:
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      story:
        "Rocky suffered from a severe infection. Timely medical care saved his life.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Impact Stories ❤️
        </motion.h1>

        {/* Stories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="h-48 w-full object-cover"
              />

              {/* Content */}
              <div className="p-6">
                <FaPaw className="text-3xl text-green-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.story}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Thank You Section */}
        <div className="mt-20 text-center">
          <FaHeart className="text-5xl text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Every story here exists because of your generosity.  
            You are not just donating — you are saving lives.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ImpactStories;
