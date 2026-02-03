import { Link } from "react-router-dom";
import {
    FaPaw,
    FaBell,
    FaHeart,
    FaHandsHelping,
    FaQuoteLeft,
} from "react-icons/fa";

const CustomerDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 animate-fadeIn">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold mb-2">
                        Customer Dashboard 🐾
                    </h1>
                    <p className="text-gray-100">
                        Your compassion makes a real difference.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">

                {/* QUOTE */}
                <div className="bg-white rounded-xl shadow p-6 text-center animate-slideUp">
                    <FaQuoteLeft className="text-green-600 text-2xl mx-auto mb-3" />
                    <p className="text-lg text-gray-700 italic">
                        “Saving one animal won’t change the world, but it will change the world for that animal.”
                    </p>
                </div>

                {/* INFO CARDS */}
                <div className="grid md:grid-cols-3 gap-6 animate-slideUp">
                    <InfoCard
                        icon={<FaHeart />}
                        title="Kindness Matters"
                        text="Every action you take helps animals feel safe and loved."
                    />
                    <InfoCard
                        icon={<FaHandsHelping />}
                        title="Community Support"
                        text="You are part of a growing network of animal protectors."
                    />
                    <InfoCard
                        icon={<FaPaw />}
                        title="Responsible Adoption"
                        text="Adoption is a lifelong promise, not just a moment."
                    />
                </div>

                {/* ACTION SECTION */}
                <div className="grid md:grid-cols-2 gap-8 animate-slideUp">

                    {/* ADOPT ANIMAL */}
                    <div className="bg-white rounded-xl shadow p-8 hover:-translate-y-1 transition">
                        <FaPaw className="text-green-600 text-4xl mb-4" />
                        <h3 className="text-2xl font-bold mb-2">
                            Adopt an Animal
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Ready to give a rescued animal a loving forever home?
                            Start your adoption journey here.
                        </p>
                        <Link to="/customer/animals"
                            className="mt-4 w-full
                           bg-blue-500 text-white font-semibold
                           py-2 px-4
                           rounded-lg
                           shadow-md
                           hover:bg-blue-700
                           hover:shadow-lg
                           active:scale-95
                           transition-all duration-200">
                            Apply for Adoption
                        </Link>
                    </div>

                    {/* REPORT ANIMAL */}
                    <div className="bg-white rounded-xl shadow p-8 hover:-translate-y-1 transition">
                        <FaBell className="text-red-600 text-4xl mb-4" />
                        <h3 className="text-2xl font-bold mb-2">
                            Report an Animal
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Seen an injured or abandoned animal?
                            Report it and our rescue team will respond.
                        </p>
                        <Link
                            to="/customer/report-animal"
                            className="mt-4 w-full
                           bg-red-500 text-white font-semibold
                           py-2 px-4
                           rounded-lg
                           shadow-md
                           hover:bg-red-700
                           hover:shadow-lg
                           active:scale-95
                           transition-all duration-200"
                        >
                            Report an Animal
                        </Link>
                    </div>
                    {/* MY ADOPTIONS */}
                    <div className="bg-white rounded-xl shadow p-8 hover:-translate-y-1 transition">
                        <FaHeart className="text-pink-600 text-4xl mb-4" />
                        <h3 className="text-2xl font-bold mb-2">
                            My Adoptions
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Track the status of your adoption requests and approvals.
                        </p>
                        <Link
                            to="/customer/my-adoptions"
                            className="mt-4 w-full
                               bg-pink-500 text-white font-semibold
                               py-2 px-4
                               rounded-lg
                               shadow-md
                               hover:bg-pink-700
                               hover:shadow-lg
                               active:scale-95
                               transition-all duration-200"
                        >
                            View My Adoptions
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CustomerDashboard;

/* ---------- Small Components ---------- */

const InfoCard = ({ icon, title, text }) => (
    <div className="bg-white rounded-xl shadow p-6 text-center hover:-translate-y-1 transition">
        <div className="text-green-600 text-3xl mb-3 mx-auto">
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
