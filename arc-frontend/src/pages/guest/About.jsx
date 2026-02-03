import {
  FaPaw,
  FaHeart,
  FaHandsHelping,
  FaUsers,
  FaAward,
  FaShieldAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Veterinarian & Founder",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
      description:
        "With 15 years of veterinary experience, Sarah founded AnimalRescue to help animals in need.",
    },
    {
      name: "Michael Chen",
      role: "Rescue Operations",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      description:
        "Leads our rescue missions and ensures animals receive immediate care.",
    },
    {
      name: "Emma Wilson",
      role: "Adoption Coordinator",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      description:
        "Helps match animals with loving families and manages adoption process.",
    },
  ];

  const values = [
    {
      icon: FaHeart,
      title: "Compassion",
      description: "We treat every animal with love, respect, and dignity.",
    },
    {
      icon: FaShieldAlt,
      title: "Protection",
      description:
        "Ensuring the safety and well-being of animals is our top priority.",
    },
    {
      icon: FaUsers,
      title: "Community",
      description:
        "We believe in working together with our community to make a difference.",
    },
    {
      icon: FaAward,
      title: "Excellence",
      description:
        "Striving for the highest standards in animal care and rehabilitation.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About AnimalRescue</h1>
          <p className="text-xl text-gray-100">
            Our mission is to rescue, rehabilitate, and rehome abandoned animals
            while promoting responsible pet ownership.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 text-lg">
              Founded in 2015, AnimalRescue began as a small community initiative
              to help stray animals.
            </p>
            <p className="text-gray-600 mb-6 text-lg">
              Today, we operate a rescue center, provide medical care, and have
              facilitated thousands of adoptions.
            </p>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <FaPaw className="text-green-600 text-2xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">5000+</div>
                <div className="text-gray-600">Animals Helped</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&h=600&fit=crop"
              alt="Rescue Center"
              className="rounded-2xl shadow-xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <FaHeart className="text-green-600 text-3xl mb-2" />
              <h3 className="text-xl font-bold">Making a Difference</h3>
              <p className="text-gray-600">One animal at a time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These principles guide everything we do
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow hover:-translate-y-1 transition text-center"
            >
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <value.icon className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dedicated professionals committed to animal welfare
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold">{member.name}</h3>
              <div className="text-green-600 font-semibold mb-2">
                {member.role}
              </div>
              <p className="text-gray-600">{member.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <FaHandsHelping className="text-yellow-300 text-5xl mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-lg mb-8 text-gray-100">
            Volunteer, adopt, or donate — become part of our family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold"
            >
              Volunteer With Us
            </Link>
            <Link
              to="/register"
              className="bg-green-800 px-8 py-3 rounded-lg font-semibold"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
