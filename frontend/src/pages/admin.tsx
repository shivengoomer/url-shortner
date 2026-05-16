import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
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
} from "recharts";
import { Link } from "react-router-dom";
import { 
  Users, 
  Link2, 
  MousePointerClick, 
  ShieldCheck, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Activity,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [urlSearch, setUrlSearch] = useState("");

  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("");

  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    type: "user" | "url" | null;
    id: string | null;
    name?: string;
  }>({ show: false, type: null, id: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, urlsData] = await Promise.all([
          apiRequest("/user/users", { auth: true }),
          apiRequest("/url", { auth: true })
        ]);
        setUsers(usersData.users || []);
        setUrls(Array.isArray(urlsData) ? urlsData : urlsData ? [urlsData] : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load management data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        toast.success("User removed successfully");
      } else {
        await apiRequest(`/url/${confirmDialog.id}`, {
          method: "DELETE",
          auth: true,
        });
        setUrls(urls.filter((u) => u._id !== confirmDialog.id));
        toast.success("Link deleted successfully");
      }
    } catch (err) {
      toast.error("Action failed. Please try again.");
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
      toast.success("Permissions updated");
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const totalClicks = urls.reduce((sum, u) => sum + (u.visitHistory?.length || 0), 0);

  const clicksTrend = [...urls]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((u) => ({
      date: new Date(u.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }),
      clicks: u.visitHistory?.length || 0,
    }));

  const roleDistribution = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  const COLORS = ["#ffffff", "#a1a1aa", "#52525b", "#27272a"];

  const filteredUsers = users.filter((u) => {
    const full = `${u.profile.firstName} ${u.profile.lastName}`.toLowerCase();
    return full.includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
  });

  const filteredUrls = urls.filter((u) => {
    const owner = users.find((x) => x._id === u.createdBy);
    const ownerName = owner ? `${owner.profile.firstName} ${owner.profile.lastName}`.toLowerCase() : "";
    return (
      u.shortId.toLowerCase().includes(urlSearch.toLowerCase()) ||
      u.longUrl.toLowerCase().includes(urlSearch.toLowerCase()) ||
      ownerName.includes(urlSearch.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white px-4 sm:px-6 py-24 sm:py-32 relative">
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/50 pb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black shadow-lg">
              <ShieldCheck className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">System Admin</h1>
              <p className="text-sm text-zinc-400">Global management and system-wide link auditing.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">System Live</span>
             </div>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "Total Platform Users", value: users.length.toLocaleString(), icon: Users },
            { label: "Generated Links", value: urls.length.toLocaleString(), icon: Link2 },
            { label: "Global Traffic", value: totalClicks.toLocaleString(), icon: MousePointerClick },
            { label: "Active Admins", value: (roleDistribution["admin"] || 0).toLocaleString(), icon: ShieldCheck },
          ].map((card, i) => (
            <div key={i} className="bg-[#040405] border border-zinc-800/60 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <card.icon className="w-5 h-5 text-zinc-500" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Metric {i+1}</span>
              </div>
              <p className="text-3xl font-semibold text-white tracking-tight">{card.value}</p>
              <p className="text-xs text-zinc-500 mt-1 font-medium">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#040405] border border-zinc-800/60 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-400" /> System Link Activity
            </h3>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={clicksTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="clicks" stroke="#ffffff" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#040405] border border-zinc-800/60 rounded-2xl shadow-sm p-6">
             <h3 className="text-base font-semibold text-white mb-6">Role Distribution</h3>
             <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={Object.entries(roleDistribution).map(([name, value]) => ({ name, value }))}
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {Object.keys(roleDistribution).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-3 mt-4">
                {Object.entries(roleDistribution).map(([role, count], i) => (
                  <div key={role} className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="capitalize text-zinc-400">{role}</span>
                    </div>
                    <span className="text-white">{count} users</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* User Management */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-zinc-400" /> User Directory
             </h2>
             <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500 transition-colors"
                />
             </div>
          </div>

          <div className="bg-[#040405] border border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-900/30 border-b border-zinc-800/80">
                    <th className="px-6 py-4 font-semibold text-zinc-400 uppercase tracking-wider text-xs">User</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400 uppercase tracking-wider text-xs">Contact</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400 uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400 uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="group hover:bg-zinc-900/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                             {u.profile.firstName[0]}{u.profile.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-white">{u.profile.firstName} {u.profile.lastName}</p>
                            <p className="text-xs text-zinc-500">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{u.email}</p>
                        <p className="text-xs text-zinc-500">{u.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        {editingRole === u._id ? (
                          <select
                            autoFocus
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            onBlur={() => handleRoleUpdate(u._id)}
                            className="bg-zinc-900 border border-zinc-700 rounded-md text-xs px-2 py-1 text-white outline-none"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-300'}`}>
                            {u.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditingRole(u._id); setNewRole(u.role); }}
                            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                            title="Edit Permissions"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDialog({ show: true, type: "user", id: u._id, name: u.email })}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Global Link Audit */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-zinc-400" /> Link Audit
             </h2>
             <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  placeholder="Search by ID or destination..."
                  value={urlSearch}
                  onChange={(e) => setUrlSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 outline-none focus:border-zinc-500 transition-colors"
                />
             </div>
          </div>

          <div className="bg-[#040405] border border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-900/30 border-b border-zinc-800/80">
                    <th className="px-6 py-4 font-semibold text-zinc-400 uppercase tracking-wider text-xs">Short Link</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400 uppercase tracking-wider text-xs">Destination & Owner</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400 uppercase tracking-wider text-xs">Engagement</th>
                    <th className="px-6 py-4 font-semibold text-zinc-400 uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredUrls.map((u) => {
                    const owner = users.find((x) => x._id === u.createdBy);
                    const ownerName = owner ? `${owner.profile.firstName} ${owner.profile.lastName}` : "Unknown Owner";

                    return (
                      <tr key={u._id} className="group hover:bg-zinc-900/20 transition-colors">
                        <td className="px-6 py-4">
                          <Link to={`/analytics/${u.shortId}`} className="inline-flex items-center gap-2 font-medium text-white hover:text-zinc-300 transition-colors">
                            <span className="text-zinc-500 font-normal">clix.app/</span>{u.shortId}
                            <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1">
                              <a href={u.longUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors truncate max-w-sm">
                                <ExternalLink className="w-3 h-3" /> {u.longUrl}
                              </a>
                              <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-bold uppercase tracking-tight">
                                 <Users className="w-3 h-3" /> {ownerName}
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 text-white font-medium">
                              <MousePointerClick className="w-3.5 h-3.5 text-zinc-500" />
                              {(u.visitHistory?.length || 0).toLocaleString()}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button
                            onClick={() => setConfirmDialog({ show: true, type: "url", id: u._id })}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Purge Link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CONFIRM DIALOG */}
        {confirmDialog.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[1500] p-4">
            <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 w-full max-w-md shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Confirm Removal</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Are you sure you want to permanently remove this {confirmDialog.type}? This action is destructive and cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDialog({ show: false, type: null, id: null })}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 font-medium transition-colors"
                >
                  Keep {confirmDialog.type}
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
