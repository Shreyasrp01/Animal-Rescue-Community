import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserRole,
  deleteUser
} from "../../services/adminUserService";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaUserShield,
  FaUser,
  FaDollarSign,
  FaTrash,
  FaEdit,
  FaSearch,
  FaFilter,
  FaSync,
  FaShieldAlt,
  FaEnvelope,
  FaPhone,
  FaCrown,
  FaUserCircle
} from "react-icons/fa";
import Loader from "../../components/common/Loader";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName, userEmail) => {
    if (loggedInUser?.email === userEmail) {
      toast.error("You cannot delete your own account");
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to delete user "${userName}"?`
    );
    if (!confirm) return;

    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleRoleChange = async (userId, oldRole, newRole, userName) => {
    if (oldRole === newRole) return;

    const confirm = window.confirm(
      `Change role of "${userName}" from ${oldRole} to ${newRole}?`
    );
    if (!confirm) {
      loadUsers(); // revert dropdown
      return;
    }

    await updateUserRole(userId, newRole);
    toast.success("Role updated successfully");
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleBadge = (role) => {
    const base = "px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide flex items-center justify-center space-x-1.5";

    if (role === "ADMIN") return `${base} bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200`;
    if (role === "DONOR") return `${base} bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200`;
    return `${base} bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200`;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <FaUserShield className="h-3.5 w-3.5" />;
      case "DONOR":
        return <FaDollarSign className="h-3.5 w-3.5" />;
      default:
        return <FaUser className="h-3.5 w-3.5" />;
    }
  };

  // Statistics
  const stats = {
    total: users.length,
    customers: users.filter(u => u.role === "CUSTOMER").length,
    donors: users.filter(u => u.role === "DONOR").length,
    admins: users.filter(u => u.role === "ADMIN").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg">
                  <FaUsers className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                  <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={loadUsers}
                className="flex items-center space-x-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaSync className="h-4 w-4" />
                <span className="font-medium">Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FaUsers className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-white p-6 rounded-2xl border border-green-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Customers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.customers}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <FaUser className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cyan-50 to-white p-6 rounded-2xl border border-cyan-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Donors</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.donors}</p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-xl">
                  <FaDollarSign className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-2xl border border-purple-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Admins</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.admins}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FaShieldAlt className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                    <span>Search Users</span>
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FaFilter className="h-4 w-4 text-gray-400" />
                    <span>Filter by Role</span>
                  </div>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setRoleFilter("ALL")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      roleFilter === "ALL"
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setRoleFilter("CUSTOMER")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      roleFilter === "CUSTOMER"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => setRoleFilter("DONOR")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      roleFilter === "DONOR"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Donor
                  </button>
                  <button
                    onClick={() => setRoleFilter("ADMIN")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      roleFilter === "ADMIN"
                        ? "bg-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="w-full bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600">Showing</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredUsers.length} of {users.length} users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-white border-b">
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <FaUserCircle className="h-4 w-4" />
                          <span>User</span>
                        </div>
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <FaEnvelope className="h-4 w-4" />
                          <span>Contact</span>
                        </div>
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Change Role
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr 
                        key={u.id} 
                        className="hover:bg-gray-50 transition-all duration-200 group"
                      >
                        {/* User Info */}
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                u.role === "ADMIN" ? "bg-gradient-to-r from-purple-100 to-pink-100" :
                                u.role === "DONOR" ? "bg-gradient-to-r from-blue-100 to-cyan-100" :
                                "bg-gradient-to-r from-green-100 to-emerald-100"
                              }`}>
                                {u.role === "ADMIN" ? (
                                  <FaCrown className="h-6 w-6 text-purple-600" />
                                ) : u.role === "DONOR" ? (
                                  <FaDollarSign className="h-6 w-6 text-blue-600" />
                                ) : (
                                  <FaUser className="h-6 w-6 text-green-600" />
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900 text-lg">{u.name}</h3>
                                {loggedInUser?.email === u.email && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                ID: <span className="font-mono text-gray-700">{u.id}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="px-8 py-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-700">
                              <FaEnvelope className="h-4 w-4 text-gray-400" />
                              <span className="font-medium">{u.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <FaPhone className="h-4 w-4 text-gray-400" />
                              <span>{u.phone || "Not provided"}</span>
                            </div>
                          </div>
                        </td>

                        {/* Current Role */}
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-2">
                            <span className={roleBadge(u.role)}>
                              {getRoleIcon(u.role)}
                              <span>{u.role}</span>
                            </span>
                            {u.role === "ADMIN" && (
                              <FaShieldAlt className="h-4 w-4 text-purple-500" />
                            )}
                          </div>
                        </td>

                        {/* Change Role */}
                        <td className="px-8 py-6">
                          {u.role !== "ADMIN" ? (
                            <div className="relative">
                              <select
                                value={u.role}
                                onChange={(e) =>
                                  handleRoleChange(
                                    u.id,
                                    u.role,
                                    e.target.value,
                                    u.name
                                  )
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 appearance-none bg-white"
                              >
                                <option value="CUSTOMER">CUSTOMER</option>
                                <option value="DONOR">DONOR</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <FaEdit className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 text-gray-500">
                              <FaShieldAlt className="h-5 w-5" />
                              <span className="text-sm font-medium">Protected Role</span>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                            {u.role !== "ADMIN" ? (
                              <button
                                onClick={() =>
                                  handleDelete(u.id, u.name, u.email)
                                }
                                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 hover:shadow-sm transition-all duration-200 group"
                              >
                                <FaTrash className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Delete</span>
                              </button>
                            ) : (
                              <div className="text-sm text-gray-400 px-3 py-2 bg-gray-100 rounded-lg">
                                Protected
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                              <FaUsers className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              No users found
                            </h3>
                            <p className="text-gray-600 max-w-md">
                              {searchTerm || roleFilter !== "ALL" 
                                ? "Try adjusting your search or filter criteria"
                                : "No users in the system yet"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              {filteredUsers.length > 0 && (
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="text-sm text-gray-600 mb-2 md:mb-0">
                      Showing <span className="font-semibold">{filteredUsers.length}</span> users
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        Need help? <button className="text-purple-600 hover:text-purple-700 font-medium">Contact support</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <FaUserShield className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Admin</p>
                <p className="text-sm text-gray-600">Full system access</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <FaDollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Donor</p>
                <p className="text-sm text-gray-600">Can donate money</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                <FaUser className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Customer</p>
                <p className="text-sm text-gray-600">Can adopt animals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;