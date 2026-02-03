import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // email passed from ForgotPassword page
  const email = location.state?.email;

  // 🚨 safety check
  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/forgot/verify-otp/${email}/${otp}`);

      toast.success("OTP verified");

      // move to reset password page
      navigate("/reset-password", {
        state: { email },
      });

    } catch (err) {
      console.error(err);
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleVerifyOtp}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-600 text-center">
          Enter the OTP sent to <br />
          <span className="font-medium">{email}</span>
        </p>

        {/* OTP */}
        <input
          type="number"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input-field text-center tracking-widest"
          placeholder="Enter OTP"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
