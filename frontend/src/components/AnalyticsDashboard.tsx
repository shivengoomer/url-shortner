import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
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
import { X, TrendingUp, MonitorSmartphone, Link as LinkIcon } from "lucide-react";

type Visit = {
  timestamp: number;
  userAgent?: string;
  referrer?: string;
  country?: string;
  ip?: string;
};

type Props = {
  shortId: string;
  onClose: () => void;
};

const COLORS = ["#ffffff", "#a1a1aa", "#52525b", "#27272a"];

const classifyDevice = (ua?: string) => {
  if (!ua) return "Desktop";
  if (/Tablet|iPad/i.test(ua)) return "Tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "Mobile";
  return "Desktop";
};

const AnalyticsDashboard: React.FC<Props> = ({ shortId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest(`/url/analytics/${shortId}`, {
          auth: true,
        });
        const v: Visit[] = data.reqUrl?.visitHistory || [];
        if (mounted) setVisits(v.slice().reverse());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analytics",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [shortId]);

  const total = visits.length;
  const now = Date.now();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startDayTs = startOfDay.getTime();
  const today = visits.filter((v) => v.timestamp >= startDayTs).length;
  const week = visits.filter(
    (v) => v.timestamp >= now - 7 * 24 * 60 * 60 * 1000,
  ).length;

  // last 14 days area data
  const days: { date: string; tsStart: number; tsEnd: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const tsStart = d.getTime();
    const tsEnd = tsStart + 24 * 60 * 60 * 1000;
    days.push({
      date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      tsStart,
      tsEnd,
    });
  }

  const areaData = days.map((day) => ({
    date: day.date,
    clicks: visits.filter(
      (v) => v.timestamp >= day.tsStart && v.timestamp < day.tsEnd,
    ).length,
  }));

  // device pie
  const deviceCounts = visits.reduce<Record<string, number>>((acc, v) => {
    const key = classifyDevice(v.userAgent);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(deviceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // top referrers
  const refCounts = visits.reduce<Record<string, number>>((acc, v) => {
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

  const maskIp = (ip?: string) => {
    if (!ip) return "-";
    if (ip.includes(".")) {
      const parts = ip.split(".");
      parts[parts.length - 1] = "xxx";
      return parts.join(".");
    }
    if (ip.includes(":")) {
      const parts = ip.split(":");
      return parts.slice(0, 2).join(":") + ":...";
    }
    return ip;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl bg-[#040405] border border-zinc-800/80 shadow-2xl flex flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-zinc-800/80 bg-[#040405]/95 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white leading-none">Traffic Analysis</h3>
              <p className="text-[10px] sm:text-xs text-zinc-500 mt-1 leading-none truncate max-w-[120px] sm:max-w-none">{window.location.hostname}/{shortId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-6 h-6 border-2 border-zinc-800 border-t-white rounded-full animate-spin mb-3"></div>
            <p className="text-zinc-500 text-xs">Compiling analytics data...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-400 text-sm">{error}</div>
        ) : (
          <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="rounded-lg bg-zinc-900/30 border border-zinc-800/60 p-3 sm:p-4">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">Total Clicks</p>
                  <p className="text-xl sm:text-2xl font-semibold text-white">{total.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-zinc-900/30 border border-zinc-800/60 p-3 sm:p-4">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">Today</p>
                  <p className="text-xl sm:text-2xl font-semibold text-white">{today.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-zinc-900/30 border border-zinc-800/60 p-3 sm:p-4 col-span-2 sm:col-span-1">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">This Week</p>
                  <p className="text-xl sm:text-2xl font-semibold text-white">{week.toLocaleString()}</p>
                </div>
              </div>

              <div className="rounded-lg bg-zinc-900/30 border border-zinc-800/60 p-3 sm:p-4">
                <h4 className="mb-4 font-medium text-xs sm:text-sm text-white flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-zinc-400" /> Clicks Over Time
                </h4>
                <div style={{ width: "100%", height: 160 }} className="sm:h-[180px]">
                  <ResponsiveContainer>
                    <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        stroke="#52525b"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        dy={8}
                        minTickGap={10}
                      />
                      <YAxis stroke="#52525b" fontSize={9} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '6px', color: '#fff', fontSize: '10px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-lg bg-zinc-900/30 border border-zinc-800/60 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-zinc-800/60">
                  <h4 className="font-medium text-xs sm:text-sm text-white">Recent Activity</h4>
                </div>
                {visits.length === 0 ? (
                  <div className="p-6 text-center text-zinc-500 text-[10px]">No activity recorded yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[10px] sm:text-xs">
                      <thead className="bg-zinc-900/50">
                        <tr>
                          <th className="px-3 py-2 sm:px-4 font-medium text-zinc-400">Time</th>
                          <th className="px-3 py-2 sm:px-4 font-medium text-zinc-400">Location</th>
                          <th className="px-3 py-2 sm:px-4 font-medium text-zinc-400">Device</th>
                          <th className="px-3 py-2 sm:px-4 font-medium text-zinc-400">Referrer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {visits.slice(0, 8).map((v, i) => (
                          <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                            <td className="px-3 py-2 sm:px-4 text-zinc-300 whitespace-nowrap">
                              {new Date(v.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </td>
                            <td className="px-3 py-2 sm:px-4 text-zinc-300">{v.country || "-"}</td>
                            <td className="px-3 py-2 sm:px-4 text-zinc-300">{classifyDevice(v.userAgent)}</td>
                            <td className="px-3 py-2 sm:px-4 text-zinc-400 truncate max-w-[80px] sm:max-w-[120px]">{v.referrer || "Direct"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
              <div className="rounded-lg bg-zinc-900/30 border border-zinc-800/60 p-3 sm:p-4">
                <h4 className="mb-3 font-medium text-xs sm:text-sm text-white flex items-center gap-2">
                  <MonitorSmartphone className="w-3.5 h-3.5 text-zinc-400" /> Devices
                </h4>
                {pieData.length === 0 ? (
                  <div className="py-8 text-center text-zinc-500 text-[10px]">Not enough data.</div>
                ) : (
                  <div style={{ width: "100%", height: 140 }} className="sm:h-[160px]">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={40}
                          outerRadius={55}
                          paddingAngle={2}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '6px', color: '#fff', fontSize: '10px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2">
                      {pieData.map((entry, i) => (
                        <div key={entry.name} className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-zinc-400">
                          <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          {entry.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-zinc-900/30 border border-zinc-800/60 p-3 sm:p-4">
                <h4 className="mb-4 font-medium text-xs sm:text-sm text-white flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5 text-zinc-400" /> Sources
                </h4>
                {topRefs.length === 0 ? (
                  <div className="py-8 text-center text-zinc-500 text-[10px]">No referrer data.</div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {topRefs.map((r) => (
                      <div key={r.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] sm:text-xs">
                          <div className="text-zinc-300 font-medium truncate max-w-[100px] sm:max-w-[130px] flex items-center gap-1.5">
                            {r.name === 'direct' ? <span className="text-zinc-500">Direct Traffic</span> : r.name}
                          </div>
                          <div className="font-semibold text-white">{r.count.toLocaleString()}</div>
                        </div>
                        <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
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
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
