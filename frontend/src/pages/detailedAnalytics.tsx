import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  ExternalLink,
  Link2,
  Calendar,
  MousePointerClick,
  Copy,
  Trash2,
  MonitorSmartphone,
  ChevronLeft
} from "lucide-react";
import { apiRequest } from "../api";
import { toast } from "sonner";
import { confirmDelete } from "../utils/confirmDelete";

interface AnalyticsData {
  reqUrl: {
    longUrl: string;
    shortId: string;
    visitHistory: {
      timestamp: number;
      _id?: { $oid: string };
      userAgent?: string;
      referrer?: string;
      country?: string;
      ip?: string;
    }[];
    createdAt?: string;
  };
  totalClicks: number;
}

const COLORS = ["#ffffff", "#a1a1aa", "#52525b", "#27272a"];

export const AnalyticsDetailPage: React.FC = () => {
  const { shortId } = useParams<{ shortId: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!shortId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await apiRequest(`/url/analytics/${shortId}`, {
          auth: true,
        });
        setData(res);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortId]);

  const copyShortUrl = () => {
    if (!data) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/${data.reqUrl.shortId}`,
    );
    toast.success("Short URL copied");
  };

  const deleteUrl = () => {
    if (!data) return;

    confirmDelete(async () => {
      setDeleting(true);
      try {
        await apiRequest(`/url/${data.reqUrl.shortId}`, {
          method: "DELETE",
          auth: true,
        });
        toast.success("URL deleted successfully");
        navigate("/analytics");
      } catch (error) {
        toast.error("Failed to delete URL");
      } finally {
        setDeleting(false);
      }
    });
  };

  /* -------- CHART DATA (CLICKS PER DAY) -------- */
  const chartData = useMemo(() => {
    if (!data) return [];

    const counts: Record<string, number> = {};
    data.reqUrl.visitHistory.forEach(({ timestamp }) => {
      const dateKey = new Date(timestamp).toISOString().split("T")[0]; // YYYY-MM-DD
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });

    // Convert to array and sort by date ascending
    return Object.entries(counts)
      .map(([isoDate, clicks]) => {
        const date = new Date(isoDate);
        return {
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }), // display
          clicks,
          sortDate: date.getTime(), // internal for sorting
        };
      })
      .sort((a, b) => a.sortDate - b.sortDate);
  }, [data]);

  const avgClicks =
    chartData.length === 0
      ? 0
      : Math.round(
          chartData.reduce((s, d) => s + d.clicks, 0) / chartData.length,
        );

  // totals: today and this week (guard if data not loaded)
  const visitsArr = data?.reqUrl?.visitHistory || [];
  const total = data?.totalClicks || 0;
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startDayTs = startOfDay.getTime();
  const todayCount = visitsArr.filter((v) => v.timestamp >= startDayTs).length;
  const weekCount = visitsArr.filter(
    (v) => v.timestamp >= now - 7 * 24 * 60 * 60 * 1000,
  ).length;

  const classifyDevice = (ua?: string) => {
    if (!ua) return "Desktop";
    if (/Tablet|iPad/i.test(ua)) return "Tablet";
    if (/Mobi|Android|iPhone/i.test(ua)) return "Mobile";
    return "Desktop";
  };

  // device pie
  const deviceCounts = visitsArr.reduce<Record<string, number>>((acc, v) => {
    const key = classifyDevice(v.userAgent);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(deviceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // top referrers
  const refCounts = visitsArr.reduce<Record<string, number>>((acc, v) => {
    const ref = v.referrer || "direct";
    let host = "direct";
    try {
      if (ref && ref !== "") {
        const u = new URL(ref);
        host = u.hostname.replace(/^www\./, "");
      }
    } catch (e) {
      host = ref || "direct";
    }
    acc[host] = (acc[host] || 0) + 1;
    return acc;
  }, {});

  const topRefs = Object.entries(refCounts)
    .map(([name, count]) => ({
      name,
      count,
      pct: total ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold">Not Found</h2>
        <p className="text-zinc-500">Could not load analytics for this link.</p>
        <Link to="/analytics" className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors">
          Back to Analytics
        </Link>
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

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-6">
          <Link to="/analytics" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#040405] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-4 flex-1 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-medium text-white">
                <Link2 className="w-4 h-4 text-zinc-400" />
                {window.location.hostname}/<span className="text-zinc-400">{data.reqUrl.shortId}</span>
              </div>
              <a
                href={data.reqUrl.longUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors truncate max-w-2xl"
              >
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{data.reqUrl.longUrl}</span>
              </a>
              {data.reqUrl.createdAt && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium tracking-wide uppercase">
                  <Calendar className="w-3.5 h-3.5" />
                  Created {new Date(data.reqUrl.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyShortUrl}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Copy className="w-4 h-4 text-zinc-400" /> Copy Link
              </button>
              <button
                onClick={deleteUrl}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
              >
                {deleting ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#040405] border border-zinc-800/60 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Clicks</p>
            <p className="text-3xl font-semibold text-white tracking-tight">{total.toLocaleString()}</p>
          </div>
          <div className="bg-[#040405] border border-zinc-800/60 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Today</p>
            <p className="text-3xl font-semibold text-white tracking-tight">{todayCount.toLocaleString()}</p>
          </div>
          <div className="bg-[#040405] border border-zinc-800/60 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">This Week</p>
            <p className="text-3xl font-semibold text-white tracking-tight">{weekCount.toLocaleString()}</p>
          </div>
          <div className="bg-[#040405] border border-zinc-800/60 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Avg. Clicks / Day</p>
            <p className="text-3xl font-semibold text-white tracking-tight">{avgClicks}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-[#040405] border border-zinc-800/60 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-zinc-400" /> Performance Overview
            </h3>
            {chartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-zinc-500 text-sm">
                No click data available yet.
              </div>
            ) : (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClicksDetailed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="clicks"
                      stroke="#ffffff"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorClicksDetailed)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Devices */}
            <div className="bg-[#040405] border border-zinc-800/60 rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <MonitorSmartphone className="w-4 h-4 text-zinc-400" /> Device Distribution
              </h3>
              {pieData.length === 0 ? (
                <div className="py-10 flex items-center justify-center text-zinc-500 text-sm">
                  Not enough data.
                </div>
              ) : (
                <div style={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {pieData.map((entry, i) => (
                      <div key={entry.name} className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                        {entry.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Referrers */}
            <div className="bg-[#040405] border border-zinc-800/60 rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-zinc-400" /> Traffic Sources
              </h3>
              {topRefs.length === 0 ? (
                <div className="py-10 flex items-center justify-center text-zinc-500 text-sm">
                  No referrer data.
                </div>
              ) : (
                <div className="space-y-4">
                  {topRefs.map((r) => (
                    <div key={r.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-zinc-300 font-medium truncate max-w-[160px]">
                          {r.name === 'direct' ? <span className="text-zinc-500">Direct Traffic</span> : r.name}
                        </div>
                        <div className="font-semibold text-white">{r.count.toLocaleString()}</div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white transition-all duration-1000"
                          style={{
                            width: `${Math.max(2, Math.round(r.pct))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
