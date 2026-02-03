import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // email passed from VerifyOtp page
  const email = location.state?.email;

  // 🚨 safety check
  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== rePassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/forgot/change-pass/${email}`, {
        password,
        rePassword,
      });

      toast.success("Password changed successfully");

      navigate("/login", { replace: true });

    } catch (err) {
      console.error(err);
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={handleResetPassword}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h2>

        {/* New Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="New Password"
          required
        />

        {/* Confirm Password */}
        <input
          type="password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          className="input-field"
          placeholder="Confirm Password"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
