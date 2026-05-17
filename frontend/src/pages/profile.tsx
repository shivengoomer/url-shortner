import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api";
import { User, Settings, Save, X } from "lucide-react";

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
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white px-4 sm:px-6 pt-32 pb-20 sm:pt-40 sm:pb-32 relative">
      {/* Subtle grid pattern background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />

      <div className="max-w-3xl mx-auto relative z-10 space-y-8">

        {/* HEADER */}
        <header className="flex items-center gap-4 border-b border-zinc-800/50 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
            <User className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Account Settings
            </h1>
            <p className="text-sm text-zinc-200">Manage your personal information and workspace preferences.</p>
          </div>
        </header>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            {success}
          </div>
        )}

        <div className="bg-[#040405] border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-800/60 bg-zinc-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-medium">
              <Settings className="w-4 h-4 text-zinc-200" />
              Profile Details
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs font-semibold px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-sm cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:bg-zinc-900 outline-none transition-colors disabled:opacity-50 disabled:bg-transparent"
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:bg-zinc-900 outline-none transition-colors disabled:opacity-50 disabled:bg-transparent"
                  placeholder="Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:bg-zinc-900 outline-none transition-colors disabled:opacity-50 disabled:bg-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:bg-zinc-900 outline-none transition-colors disabled:opacity-50 disabled:bg-transparent"
                  placeholder="123 Main St"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">State / Province</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:bg-zinc-900 outline-none transition-colors disabled:opacity-50 disabled:bg-transparent"
                  placeholder="CA"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">ZIP / Postal Code</label>
                <input
                  name="zipCode"
                  value={form.zipCode}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-white text-sm focus:border-zinc-500 focus:bg-zinc-900 outline-none transition-colors disabled:opacity-50 disabled:bg-transparent"
                  placeholder="90210"
                />
              </div>
            </div>

            {editing && (
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-800/50 mt-6">
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
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Changes</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
