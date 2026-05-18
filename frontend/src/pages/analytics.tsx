import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";
import {
  Link2,
  TrendingUp,
  MousePointerClick,
  ExternalLink,
  Copy,
  QrCode,
  BarChart,
  Calendar,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import QRModal from "../components/QRModal";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

interface Url {
  _id: string;
  longUrl: string;
  shortId: string;
  visitHistory: { timestamp: number }[];
  createdAt?: string;
}

export const AnalyticsListPage: React.FC = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const origin = typeof window !== "undefined" ? window.location.hostname : "";
  const [qrOpen, setQrOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [selectedShort, setSelectedShort] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setLoading(true);
        const res = await apiRequest("/url", { auth: true });
        const urlArray: Url[] = Array.isArray(res) ? res : [];

        urlArray.sort((a, b) => {
          const t1 = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const t2 = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return t2 - t1;
        });

        setUrls(urlArray);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white px-4 sm:px-6 pt-24 pb-16 sm:pt-40 sm:pb-32 relative">
      {/* Subtle grid pattern background */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />

      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 relative z-10">
        {/* HEADER */}
        <header className="text-center space-y-3 sm:space-y-4 border-b border-zinc-800/50 pb-8 sm:pb-10">
          <div className="flex flex-row justify-center items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white text-black shadow-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              Analytics Dashboard
            </h1>
          </div>

          <p className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto px-2">
            Track and monitor performance metrics for all your shortened links across your workspace.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-20 sm:py-24">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-zinc-800 border-t-white"></div>
            <p className="mt-4 text-xs sm:text-sm text-zinc-500">Loading workspace analytics...</p>
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-16 sm:py-24 bg-[#040405] rounded-2xl border border-zinc-800/50">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800">
              <Link2 className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">No active links</h3>
            <p className="text-zinc-500 text-xs sm:text-sm mt-2 max-w-sm mx-auto mb-6 px-4">
              You haven't created any short links in this workspace yet. Create one to start tracking analytics.
            </p>
            <Link to="/shorten" className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-zinc-200">
              Create New Link
            </Link>
          </div>
        ) : (
          <>
            {/* STATS SUMMARY */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
              <div className="bg-[#040405] border border-zinc-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  <p className="text-zinc-400 text-[10px] sm:text-sm font-medium">Active Links</p>
                </div>
                <p className="text-2xl sm:text-5xl font-semibold text-white tracking-tight">{urls.length}</p>
              </div>
              
              <div className="bg-[#040405] border border-zinc-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <p className="text-zinc-400 text-[10px] sm:text-sm font-medium">Engagement</p>
                </div>
                <p className="text-2xl sm:text-5xl font-semibold text-white tracking-tight">
                  {urls.reduce((sum, url) => sum + url.visitHistory.length, 0).toLocaleString()}
                </p>
              </div>

              <div className="bg-[#040405] border border-zinc-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                  <p className="text-zinc-400 text-[10px] sm:text-sm font-medium">Conversion Rate</p>
                </div>
                <p className="text-2xl sm:text-5xl font-semibold text-white tracking-tight">
                  {Math.round(
                    urls.reduce(
                      (sum, url) => sum + url.visitHistory.length,
                      0,
                    ) / urls.length,
                  )} <span className="text-xs sm:text-xl text-zinc-600 font-normal">/ link</span>
                </p>
              </div>
            </div>

            {/* DATA TABLE / CARDS */}
            <div className="mt-4 sm:mt-8">
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg sm:text-xl font-semibold text-white">All Short Links</h2>
                <div className="text-[10px] sm:text-xs text-zinc-500 font-medium bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                  {urls.length} Total
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-[#040405] border border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800/80 bg-zinc-900/30">
                        <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Short Link</th>
                        <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Original URL</th>
                        <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Clicks</th>
                        <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Created</th>
                        <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {urls.map((url) => (
                        <tr key={url._id} className="group hover:bg-zinc-900/20 transition-colors">
                          <td className="py-4 px-6 whitespace-nowrap">
                            <Link
                              to={`/analytics/${url.shortId}`}
                              className="inline-flex items-center gap-2 font-medium text-white hover:text-zinc-300 transition-colors"
                            >
                              <span className="text-zinc-500">{origin}/</span>
                              <span>{url.shortId}</span>
                            </Link>
                          </td>
                          <td className="py-4 px-6 max-w-[200px] lg:max-w-[300px]">
                            <a
                              href={url.longUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors truncate w-full"
                            >
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{url.longUrl}</span>
                            </a>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <MousePointerClick className="w-4 h-4 text-zinc-500" />
                              <span className="text-sm font-medium text-white">
                                {url.visitHistory.length.toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-zinc-500" />
                              <span className="text-sm text-zinc-400">
                                {url.createdAt ? new Date(url.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/${url.shortId}`);
                                  toast.success("Short URL copied");
                                }}
                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                                title="Copy"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedShort(url.shortId);
                                  setQrOpen(true);
                                }}
                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                                title="QR Code"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedShort(url.shortId);
                                  setAnalyticsOpen(true);
                                }}
                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                                title="Analytics"
                              >
                                <BarChart className="w-4 h-4" />
                              </button>
                              <div className="h-4 w-px bg-zinc-800 mx-1"></div>
                              <Link
                                to={`/analytics/${url.shortId}`}
                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                                title="View Details"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3 sm:space-y-4">
                {urls.map((url) => (
                  <div key={url._id} className="bg-[#040405] border border-zinc-800/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <Link
                        to={`/analytics/${url.shortId}`}
                        className="flex flex-col gap-1 min-w-0"
                      >
                        <span className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">Short Link</span>
                        <span className="text-white font-semibold text-base sm:text-lg truncate">
                          {origin}/{url.shortId}
                        </span>
                      </Link>
                      <div className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2">
                        <MousePointerClick className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {url.visitHistory.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">Destination</span>
                      <a
                        href={url.longUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400 truncate"
                      >
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{url.longUrl}</span>
                      </a>
                    </div>

                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-zinc-800/50">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {url.createdAt ? new Date(url.createdAt).toLocaleDateString() : "-"}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/${url.shortId}`);
                            toast.success("Copied");
                          }}
                          className="p-1.5 sm:p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800"
                        >
                          <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedShort(url.shortId);
                            setAnalyticsOpen(true);
                          }}
                          className="p-1.5 sm:p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800"
                        >
                          <BarChart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <Link
                          to={`/analytics/${url.shortId}`}
                          className="bg-white text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-1.5"
                        >
                          Details <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>

      {selectedShort && qrOpen && (
        <QRModal
          open={qrOpen}
          onClose={() => setQrOpen(false)}
          shortUrl={`${window.location.origin}/${selectedShort}`}
        />
      )}

      {selectedShort && analyticsOpen && (
        <AnalyticsDashboard
          shortId={selectedShort}
          onClose={() => setAnalyticsOpen(false)}
        />
      )}
    </div>
  );
};