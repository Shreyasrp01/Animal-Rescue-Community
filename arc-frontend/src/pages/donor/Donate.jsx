import { useState } from "react";
import api from "../../services/api";

const Donate = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/api/payments/create-order", {
        amount: Number(amount),
        paymentType: "DONATION",
        referenceId: 1,
      });

      const options = {
        key: data.razorpayKey,
        amount: data.amount * 100,
        currency: "INR",
        name: "Animal Rescue Community",
        description: "Donation for animal welfare",
        order_id: data.orderId,

        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },

        upi: { flow: "collect" },

        handler: async function (response) {
          await api.post("/api/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          alert("🎉 Payment Successful. Thank you!");
        },

        theme: { color: "#16a34a" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error(error);
      alert("Unable to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🌟 HERO SECTION */}
      <div className="relative h-72">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b"
          alt="Donate Animals"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">
            Save a Life Today 🐾
          </h1>
        </div>
      </div>

      {/* 💖 CONTENT */}
      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">

        {/* LEFT – IMPACT CARDS */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Where Your Donation Goes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Medical Care",
                img: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8",
              },
              {
                title: "Food & Shelter",
                img: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a",
              },
              {
                title: "Animal Rescue",
                img: "https://images.unsplash.com/photo-1601758177266-bc599de87707",
              },
              {
                title: "Rehabilitation",
                img: "https://images.unsplash.com/photo-1558788353-f76d92427f16",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-32 w-full object-cover"
                />
                <p className="p-3 font-semibold text-center">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT – DONATE FORM */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Donate for a Cause ❤️
          </h2>

          <form onSubmit={handleDonate}>
            <label className="block text-gray-600 mb-2">
              Donation Amount (₹)
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Enter amount"
              required
            />

            {/* Quick Amounts */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {[500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className="px-4 py-2 border rounded-full text-sm hover:bg-green-100"
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Processing..." : "Donate Now"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Secure payments powered by Razorpay 🔒
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
