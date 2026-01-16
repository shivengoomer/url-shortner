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
  Copy,
  Trash2,
} from "lucide-react";
import { apiRequest } from "../api";
import CopyButton from "@/components/copyButton";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    toast.success("Short URL copied to clipboard!", {
      position: "top-right",
    });
  };

  const deleteUrl = async () => {
    if (!data) return;

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this URL? This action cannot be undone.",
    );
    if (!shouldDelete) return;

    setDeleting(true);
    try {
      await apiRequest(`/url/${data.reqUrl.shortId}`, {
        method: "DELETE",
        auth: true,
      });
      toast.success("URL deleted successfully", {
        position: "top-right",
      });
      navigate("/short");
    } catch (error) {
      toast.error("Failed to delete URL", {
        position: "top-right",
      });
    } finally {
      setDeleting(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-white/10 rounded-xl border border-white/20">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Link Analytics</h1>
              <p className="text-sm sm:text-base text-gray-400">
                Performance & engagement overview
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={copyShortUrl}
              className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-colors group"
              title="Copy short URL"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-white" />
            </button>
            <button
              onClick={deleteUrl}
              disabled={deleting}
              className="p-2 sm:p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 transition-colors disabled:opacity-50 group"
              title="Delete URL"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 group-hover:text-red-300" />
            </button>
          </div>
        </header>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Link Details
          </h2>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="text-gray-400 text-lg sm:text-xl font-semibold mb-1">
                Original URL :{" "}
              </p>
              <a
                href={data.reqUrl.longUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm sm:text-base text-white hover:underline break-all"
              >
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                {data.reqUrl.longUrl}
              </a>
            </div>

            <div>
              <p className="text-gray-400 text-lg sm:text-xl font-semibold mb-1">
                Short URL
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href={`${window.location.origin}/${data.reqUrl.shortId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base sm:text-lg font-semibold text-white hover:underline break-all"
                >
                  {window.location.hostname}/{data.reqUrl.shortId}
                </a>
              </div>
            </div>
          </div>
        </div>
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

        {/* CHART */}
        {/* CHART + VISIT HISTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* CHART */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
              Clicks Over Time
            </h2>

            {chartData.length === 0 ? (
              <p className="text-gray-400">No clicks yet</p>
            ) : (
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="date"
                      stroke="#aaa"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#aaa"
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                    />
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
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 max-h-[28rem] sm:max-h-[32rem] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              Visit History (Newest First)
            </h2>

            {sortedVisits.length === 0 ? (
              <p className="text-gray-400">No visits yet.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {sortedVisits.map((visit, idx) => (
                  <li
                    key={visit._id?.$oid || idx}
                    className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 text-gray-200 text-xs sm:text-sm"
                  >
                    <span>Visit #{sortedVisits.length - idx}</span>
                    <span className="text-gray-400 sm:text-gray-200">
                      {visit.formatted}
                    </span>
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
