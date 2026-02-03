import { Routes, Route, Navigate } from "react-router-dom";

/* 🌍 Public */
import Home from "../pages/guest/Home";
import About from "../pages/guest/About";
import Contact from "../pages/guest/Contact";

/* 🔐 Auth */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* 👤 Customer */
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import ReportAnimal from "../pages/customer/ReportAnimal";
import Animals from "../pages/customer/Animals";
import ApplyAdoption from "../pages/customer/ApplyAdoption";
import MyAdoptions from "../pages/customer/MyAdoptions";

/* 💰 Donor */
import DonorDashboard from "../pages/donor/DonorDashboard";
import Donate from "../pages/donor/Donate";
import DonateHistory from "../pages/donor/DonationHistory";
import ImpactStories from "../pages/donor/ImpactStories";

/* 🛡️ Admin */
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageAnimals from "../pages/admin/ManageAnimals";
import ApprovedAdoptions from "../pages/admin/ApproveAdoptions";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageExpenses from "../pages/admin/ManageExpenses";

/* 🔒 Protected */
import ProtectedRoute from "../components/common/ProtectedRoute";

/* 🔑 Forgot Password */
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ResetPassword from "../pages/auth/ResetPassword";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 🌍 Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* 🔐 Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🔑 Forgot Password */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 👤 Customer */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute role="CUSTOMER">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/my-adoptions"
        element={
          <ProtectedRoute role="CUSTOMER">
            <MyAdoptions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/animals"
        element={
          <ProtectedRoute role="CUSTOMER">
            <Animals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/apply-adoption/:animalId"
        element={
          <ProtectedRoute role="CUSTOMER">
            <ApplyAdoption />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/report-animal"
        element={
          <ProtectedRoute role="CUSTOMER">
            <ReportAnimal />
          </ProtectedRoute>
        }
      />

      {/* 💰 Donor */}
      <Route
        path="/donor/dashboard"
        element={
          <ProtectedRoute role="DONOR">
            <DonorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/donor/donate"
        element={
          <ProtectedRoute role="DONOR">
            <Donate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/donor/history"
        element={
          <ProtectedRoute role="DONOR">
            <DonateHistory />
          </ProtectedRoute>
        }
      />
      <Route path="/donor/impact" element={<ImpactStories />} />

      {/* 🛡️ Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/manage-expenses"
        element={
          <ProtectedRoute role="ADMIN">
            <ManageExpenses  />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-animals"
        element={
          <ProtectedRoute role="ADMIN">
            <ManageAnimals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/approved-adoptions"
        element={
          <ProtectedRoute role="ADMIN">
            <ApprovedAdoptions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-users"
        element={
          <ProtectedRoute role="ADMIN">
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      {/* ❌ Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
