import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

import { Header } from "../components/header";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";

interface User {
  _id: string;
  email: string;
  phone: string;
  role: string;
  profile: { firstName: string; lastName: string };
  createdAt: string;
}

interface URLData {
  _id: string;
  shortId: string;
  longUrl: string;
  createdAt: string;
  createdBy?: string;
  owner?: { profile: { firstName: string; lastName: string } };
  visitHistory?: { timestamp: number; _id: string }[];
}

export const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [urls, setUrls] = useState<URLData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingURLs, setLoadingURLs] = useState(true);
  const [error, setError] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [urlSearch, setUrlSearch] = useState("");

  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("");

  // Custom Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    type: "user" | "url" | null;
    id: string | null;
    name?: string;
  }>({ show: false, type: null, id: null });

  // Fetch Users
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiRequest("/user/users", { auth: true });
        setUsers(data.users || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetch();
  }, []);

  // Fetch URLs
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await apiRequest("/url", { auth: true });
        setUrls(Array.isArray(data) ? data : data ? [data] : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load URLs");
      } finally {
        setLoadingURLs(false);
      }
    };
    fetch();
  }, []);

  const handleConfirmDelete = async () => {
    if (!confirmDialog.id || !confirmDialog.type) return;

    try {
      if (confirmDialog.type === "user") {
        await apiRequest(`/user/users/${confirmDialog.id}`, {
          method: "DELETE",
          auth: true,
        });
        setUsers(users.filter((u) => u._id !== confirmDialog.id));
      } else {
        await apiRequest(`/url/${confirmDialog.id}`, {
          method: "DELETE",
          auth: true,
        });
        setUrls(urls.filter((u) => u._id !== confirmDialog.id));
      }
    } finally {
      setConfirmDialog({ show: false, type: null, id: null });
    }
  };

  const handleRoleUpdate = async (userId: string) => {
    try {
      await apiRequest(`/user/users/${userId}/role`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ role: newRole }),
      });
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
      setEditingRole(null);
      setNewRole("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  // Analytics
  const totalClicks = urls.reduce(
    (sum, u) => sum + (u.visitHistory?.length || 0),
    0,
  );

  const clicksTrend = [...urls]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map((u) => ({
      date: new Date(u.createdAt).toLocaleDateString(),
      clicks: u.visitHistory?.length || 0,
    }));

  const roleDistribution = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  const filteredUsers = users.filter((u) => {
    const full = `${u.profile.firstName} ${u.profile.lastName}`.toLowerCase();
    return (
      full.includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  const filteredUrls = urls.filter((u) => {
    const owner = users.find((x) => x._id === u.createdBy);
    const ownerName = owner
      ? `${owner.profile.firstName} ${owner.profile.lastName}`.toLowerCase()
      : "";
    return (
      u.shortId.toLowerCase().includes(urlSearch.toLowerCase()) ||
      u.longUrl.toLowerCase().includes(urlSearch.toLowerCase()) ||
      ownerName.includes(urlSearch.toLowerCase())
    );
  });

  if (loadingUsers || loadingURLs)
    return <div className="text-center text-gray-300 mt-20">Loading...</div>;
  if (error)
    return <div className="text-center text-red-400 mt-20">{error}</div>;

  return (
    <div className="min-h-screen text-white p-6 overflow-x-hidden">
      <div className="relative z-10 space-y-8">
        <h1 className="mt-15 text-5xl font-black tracking-tight items-center text-center">
          Admin Dashboard
        </h1>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: users.length },
            { label: "Total URLs", value: urls.length },
            { label: "Total Clicks", value: totalClicks },
            { label: "Admins", value: roleDistribution["admin"] || 0 },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1"
            >
              <span className="text-gray-400 text-sm">{card.label}</span>
              <span className="text-2xl font-bold">{card.value}</span>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h2 className="mb-3 font-medium">User Roles</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={Object.entries(roleDistribution).map(
                    ([name, value]) => ({
                      name:
                        name.charAt(0).toUpperCase() +
                        name.slice(1).toLowerCase(),
                      value,
                    }),
                  )}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {Object.keys(roleDistribution).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-sm opacity-75 mt-1">
              Total:{" "}
              {Object.values(roleDistribution).reduce((a, b) => a + b, 0)}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h2 className="mb-2 font-medium">Clicks Over Time</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={clicksTrend}>
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* === Users === */}
        <input
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="items-center justify-center  bg-white/5 border border-white/10 px-3 py-2 rounded-lg w-full md:max-w-3/4 focus:ring-2 focus:ring-white/20 outline-none"
        />

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                {["Name", "Email", "Phone", "Role", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-medium text-gray-300"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-white/5">
                  <td className="px-4 py-3">
                    {u.profile.firstName} {u.profile.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-300">{u.email}</td>
                  <td className="px-4 py-3 text-gray-400">{u.phone}</td>
                  <td className="px-4 py-3">
                    {editingRole === u._id ? (
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-lg px-2 py-1"
                      >
                        <option value="">Select role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="bg-white/10 px-3 py-1 rounded-lg capitalize">
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-7">
                    {editingRole === u._id ? (
                      <>
                        <button
                          onClick={() => handleRoleUpdate(u._id)}
                          className="text-green-400 hover:text-green-300"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRole(null)}
                          className="text-gray-300 hover:text-gray-200"
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
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setConfirmDialog({
                              show: true,
                              type: "user",
                              id: u._id,
                              name: u.email,
                            })
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* === URLs === */}
        <input
          placeholder="Search URLs..."
          value={urlSearch}
          onChange={(e) => setUrlSearch(e.target.value)}
          className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg w-full md:w-3/4 focus:ring-2 focus:ring-white/20 outline-none"
        />

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-auto max-h-[26rem]">
          <table className="w-full text-sm">
            <thead className="bg-white/5 backdrop-blur-3xl sticky top-0 ">
              <tr>
                {[
                  "Short",
                  "Original",
                  "Owner",
                  "Clicks",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-medium text-gray-300"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUrls.map((u) => {
                const owner = users.find((x) => x._id === u.createdBy);
                const ownerName = owner
                  ? `${owner.profile.firstName} ${owner.profile.lastName}`
                  : u.owner?.profile
                    ? `${u.owner.profile.firstName} ${u.owner.profile.lastName}`
                    : "Unknown";

                return (
                  <tr key={u._id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-[#10B981]">
                      <Link to={`/analytics/${u.shortId}`}>{u.shortId}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-300 truncate max-w-xs">
                      {u.longUrl}
                    </td>
                    <td className="px-4 py-3">{ownerName}</td>
                    <td className="px-4 py-3">{u.visitHistory?.length || 0}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setConfirmDialog({
                            show: true,
                            type: "url",
                            id: u._id,
                          })
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* === Confirm Dialog === */}
        {confirmDialog.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[999]">
            <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-4 w-[90%] max-w-md">
              <h3 className="text-lg font-medium">Confirm Delete</h3>
              <p className="text-gray-400">
                Are you sure you want to delete this{" "}
                {confirmDialog.type === "user" ? "user" : "URL"}?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() =>
                    setConfirmDialog({ show: false, type: null, id: null })
                  }
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
