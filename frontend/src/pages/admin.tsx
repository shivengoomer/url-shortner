import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api";
import Aurora from "../components/background";
import { Header } from "../components/header";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  email: string;
  phone: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export const AdminPage: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await apiRequest("/user/users", { auth: true });
        setUsers(data.users);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, navigate]);

  const handleRoleUpdate = async (userId: string) => {
    try {
      await apiRequest(`/user/users/${userId}/role`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ role: newRole }),
      });

      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      setEditingRole(null);
      setNewRole("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await apiRequest(`/user/users/${userId}`, {
        method: "DELETE",
        auth: true,
      });

      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 relative">
      <div className="fixed inset-0 z-0">
        <Aurora />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="max-w-7xl mx-auto py-24">
          <h1 className="text-3xl font-bold mb-8">User Management</h1>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4">
                          {u.profile.firstName} {u.profile.lastName}
                        </td>
                        <td className="px-6 py-4 text-gray-300">{u.email}</td>
                        <td className="px-6 py-4 text-gray-300">{u.phone}</td>
                        <td className="px-6 py-4">
                          {editingRole === u._id ? (
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="px-3 py-1 rounded-lg bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                            >
                              <option value="">Select role</option>
                              <option value="user">User</option>
                              <option value="volunteer">Volunteer</option>
                              <option value="authority">Authority</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className="px-3 py-1 rounded-lg bg-white/10 text-sm capitalize">
                              {u.role}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {editingRole === u._id ? (
                              <>
                                <button
                                  onClick={() => handleRoleUpdate(u._id)}
                                  disabled={!newRole}
                                  className="px-3 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-200 text-sm transition disabled:opacity-50"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingRole(null);
                                    setNewRole("");
                                  }}
                                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingRole(u._id);
                                    setNewRole(u.role);
                                  }}
                                  className="px-3 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-sm transition"
                                >
                                  Edit Role
                                </button>
                                {u._id !== user?.id && (
                                  <button
                                    onClick={() => handleDeleteUser(u._id)}
                                    className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm transition"
                                  >
                                    Delete
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-400">
            Total Users: {users.length}
          </div>
        </div>
      </div>
    </div>
  );
};
