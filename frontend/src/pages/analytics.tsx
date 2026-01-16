import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";
import {
  Link2,
  TrendingUp,
  MousePointerClick,
  ExternalLink,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-4 sm:px-6 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* HEADER */}
        <header className="text-center space-y-3">
          <div className="flex flex-row justify-center-safe gap-3 ">
            <div className="inline-flex p-3 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl border border-white/30 mb-1 ">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
          </div>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Track and monitor performance metrics for all your shortened links
          </p>
        </header>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
            <p className="mt-4 text-gray-400">Loading analytics...</p>
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <div className="p-4 bg-white/10 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Link2 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">No links created yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Start by creating your first short link
            </p>
          </div>
        ) : (
          <>
            {/* STATS SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Total Links
                </p>
                <p className="text-3xl sm:text-4xl font-bold">{urls.length}</p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Total Clicks
                </p>
                <p className="text-3xl sm:text-4xl font-bold">
                  {urls.reduce((sum, url) => sum + url.visitHistory.length, 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
                <p className="text-gray-400 text-sm font-medium mb-1">
                  Avg Clicks/Link
                </p>
                <p className="text-3xl sm:text-4xl font-bold">
                  {Math.round(
                    urls.reduce(
                      (sum, url) => sum + url.visitHistory.length,
                      0,
                    ) / urls.length,
                  )}
                </p>
              </div>
            </div>

            {/* LINKS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {urls.map((url) => (
                <div
                  key={url._id}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

                  <div className="relative space-y-4">
                    {/* Original URL */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wide">
                        Original URL
                      </p>
                      <a
                        href={url.longUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors truncate group/link"
                      >
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-60 group-hover/link:opacity-100" />
                        <span className="truncate">{url.longUrl}</span>
                      </a>
                    </div>

                    {/* Short URL */}
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1.5 uppercase tracking-wide">
                        Short Link
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          to={`/analytics/${url.shortId}`}
                          className="flex items-center gap-2 font-semibold text-white hover:text-gray-200 transition-colors truncate group/short"
                        >
                          <Link2 className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover/short:text-white" />
                          <span className="truncate text-base">
                            {origin}/{url.shortId}
                          </span>
                        </Link>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${window.location.origin}/${url.shortId}`,
                            );
                            toast.success("Short URL copied to clipboard!", {
                              position: "top-right",
                            });
                          }}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all group/copy"
                          title="Copy short URL"
                        >
                          <Copy className="w-4 h-4 text-gray-400 group-hover/copy:text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Stats & Date */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <MousePointerClick className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Clicks</p>
                          <p className="text-lg font-bold">
                            {url.visitHistory.length}
                          </p>
                        </div>
                      </div>

                      {url.createdAt && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="text-xs text-gray-400 font-medium">
                            {new Date(url.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* View Details Link */}
                    <Link
                      to={`/analytics/${url.shortId}`}
                      className="block w-full text-center py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium border border-white/10 hover:border-white/20 transition-all"
                    >
                      View Detailed Analytics →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
