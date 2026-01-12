import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api";
import { Link2, TrendingUp, MousePointerClick } from "lucide-react";
import CopyButton from "@/components/copyButton";

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
  const origin = typeof window !== "undefined" ? window.location.origin : "";

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
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        <header className="flex items-center gap-3 sm:gap-4 sm:ml-15 mt-3 sm:mt-5">
          <div className="p-2 sm:p-3 bg-white/10 rounded-xl border border-white/20">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Analytics Overview
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Monitor performance across all your links
            </p>
          </div>
        </header>

        {loading ? (
          <p className="text-center text-gray-400">Loading links...</p>
        ) : urls.length === 0 ? (
          <p className="text-center text-gray-400">No links created yet</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {urls.map((url) => (
              <div
                key={url._id}
                className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 w-full">
                  <Link
                    to={`/analytics/${url.shortId}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="space-y-1">
                      <p className="text-gray-400 text-sm truncate">
                        {url.longUrl}
                      </p>

                      <div className="flex items-center gap-2 mt-2 font-medium truncate">
                        <Link2 className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        <span className="truncate text-sm sm:text-base">
                          {origin}/{url.shortId}
                        </span>
                      </div>

                      {url.createdAt && (
                        <p className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(url.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <MousePointerClick className="w-4 h-4" />
                      {url.visitHistory.length}
                    </div>

                    <CopyButton
                      label="Copy Link"
                      done="Copied!"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${origin}/${url.shortId}`
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
