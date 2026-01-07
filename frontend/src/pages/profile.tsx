import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api";
import Aurora from "../components/background";
import { Header } from "../components/header";

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    phone: user?.phone || "",
    address: user?.profile?.address || "",
    state: user?.profile?.state || "",
    zipCode: user?.profile?.zipCode || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await apiRequest("/user/me", {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({
          profile: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            state: form.state,
            zipCode: form.zipCode,
          },
          phone: form.phone,
        }),
      });

      setSuccess("Profile updated successfully!");
      setEditing(false);
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 relative">
      <div className="fixed inset-0 z-0">
        <Aurora />
      </div>

      <div className="relative z-10">
        <Header />

        <div className="max-w-3xl mx-auto py-24">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">My Profile</h1>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/50 text-green-200">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 cursor-not-allowed opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Role</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 cursor-not-allowed opacity-60 capitalize"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    State
                  </label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Zip Code
                  </label>
                  <input
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {editing && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setError("");
                      setSuccess("");
                      setForm({
                        firstName: user?.profile?.firstName || "",
                        lastName: user?.profile?.lastName || "",
                        phone: user?.phone || "",
                        address: user?.profile?.address || "",
                        state: user?.profile?.state || "",
                        zipCode: user?.profile?.zipCode || "",
                      });
                    }}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
