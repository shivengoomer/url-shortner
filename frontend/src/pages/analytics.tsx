import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";
import { Link2, TrendingUp, MousePointerClick } from "lucide-react";

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

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setLoading(true);
        const res = await apiRequest("/url", { auth: true });
        const urlArray: Url[] = Array.isArray(res) ? res : [];

        // Sort newest first
        urlArray.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );

        setUrls(urlArray);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 py-24">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <header className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl border border-white/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Analytics Overview</h1>
            <p className="text-gray-400">
              Monitor performance across all your links
            </p>
          </div>
        </header>

        {/* CONTENT */}
        <div className="space-y-4">
          {loading && (
            <p className="text-center text-gray-400">Loading links...</p>
          )}

          {!loading && urls.length === 0 && (
            <p className="text-center text-gray-400">No links created yet</p>
          )}

          {urls.map((url) => (
            <Link
              to={`/analytics/${url.shortId}`}
              key={url._id}
              className="group block bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition"
            >
              <div className="flex justify-between items-center">
                <div className="max-w-[70%] space-y-1">
                  <p className="text-gray-400 text-sm truncate">
                    {url.longUrl}
                  </p>

                  <div className="flex items-center gap-2 mt-2 font-medium">
                    <Link2 className="w-4 h-4 text-gray-300" />
                    short.ly/{url.shortId}
                  </div>

                  {url.createdAt && (
                    <p className="text-xs text-gray-500">
                      Created: {new Date(url.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <MousePointerClick className="w-4 h-4" />
                  {url.visitHistory.length}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
