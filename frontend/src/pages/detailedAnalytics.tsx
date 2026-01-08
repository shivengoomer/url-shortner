import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  ExternalLink,
  Link2,
  Calendar,
  MousePointerClick,
} from "lucide-react";
import { apiRequest } from "../api";

interface AnalyticsData {
  reqUrl: {
    longUrl: string;
    shortId: string;
    visitHistory: { timestamp: number; _id?: { $oid: string } }[];
  };
  totalClicks: number;
}

export const AnalyticsDetailPage: React.FC = () => {
  const { shortId } = useParams<{ shortId: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

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
          chartData.reduce((s, d) => s + d.clicks, 0) / chartData.length
        );

  /* -------- VISITS SORTED (NEWEST FIRST) -------- */
  const sortedVisits = useMemo(() => {
    if (!data) return [];

    return [...data.reqUrl.visitHistory]
      .sort((a, b) => b.timestamp - a.timestamp) // newest first
      .map((visit) => ({
        ...visit,
        formatted: new Date(visit.timestamp).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      }));
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading analytics...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 py-24">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* HEADER */}
        <header className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl border border-white/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Link Analytics</h1>
            <p className="text-gray-400">Performance & engagement overview</p>
          </div>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<MousePointerClick />}
            label="Total Clicks"
            value={data.totalClicks}
          />
          <StatCard
            icon={<Calendar />}
            label="Avg Daily Clicks"
            value={avgClicks}
          />
          <StatCard
            icon={<TrendingUp />}
            label="Peak Day"
            value={
              chartData.length ? Math.max(...chartData.map((d) => d.clicks)) : 0
            }
          />
        </div>

        {/* LINK DETAILS */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Link Details
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Original URL</p>
              <a
                href={data.reqUrl.longUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:underline break-all"
              >
                <ExternalLink className="w-4 h-4" />
                {data.reqUrl.longUrl}
              </a>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Short URL</p>
              <code className="text-lg font-semibold">
                short.ly/{data.reqUrl.shortId}
              </code>
            </div>
          </div>
        </div>

        {/* CHART */}
        {/* CHART + VISIT HISTORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CHART */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6">Clicks Over Time</h2>

            {chartData.length === 0 ? (
              <p className="text-gray-400">No clicks yet</p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#aaa" />
                    <YAxis stroke="#aaa" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111",
                        border: "1px solid #333",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#ffffff"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* VISIT HISTORY */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-h-[32rem] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Visit History (Newest First)
            </h2>

            {sortedVisits.length === 0 ? (
              <p className="text-gray-400">No visits yet.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {sortedVisits.map((visit, idx) => (
                  <li
                    key={visit._id?.$oid || idx}
                    className="py-2 flex justify-between items-center text-gray-200 text-sm"
                  >
                    <span>Visit #{sortedVisits.length - idx}</span>
                    <span>{visit.formatted}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------- SMALL STAT CARD -------- */
const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white/10 rounded-xl">{icon}</div>
    </div>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-4xl font-bold">{value}</p>
  </div>
);
