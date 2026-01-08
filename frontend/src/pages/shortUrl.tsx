import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { MousePointerClick } from "lucide-react";
interface Url {
  _id: string;
  longUrl: string;
  shortId: string;
  visitHistory: { timestamp: number }[];
  createdAt?: string;
}

export const ShortUrlPage: React.FC = () => {
  const [longUrl, setLongUrl] = useState("");
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUrls = async () => {
    try {
      const data = await apiRequest("/url", { auth: true });
      const urlArray: Url[] = Array.isArray(data) ? data : [];

      // Sort newest first
      urlArray.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      );

      setUrls(urlArray);
    } catch {
      setUrls([]);
    }
  };

  const createShortUrl = async () => {
    if (!longUrl.trim()) return alert("Please enter a valid URL");

    try {
      setLoading(true);
      await apiRequest("/url", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ longUrl }),
      });
      setLongUrl("");
      fetchUrls();
    } finally {
      setLoading(false);
    }
  };

  const deleteUrl = async (id: string) => {
    if (!confirm("Delete this short URL?")) return;

    try {
      setDeletingId(id);
      await apiRequest(`/url/${id}`, {
        method: "DELETE",
        auth: true,
      });
      fetchUrls();
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 py-30 mt-10 ">
      <div className="max-w-5xl mx-auto space-y-14">
        {/* HEADER */}
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">URL Shortener</h1>
          <p className="text-gray-400 mt-2">
            Create, manage & track your short links
          </p>
        </header>

        {/* CREATE CARD */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">
            Create a new short link
          </h2>

          <div className="flex gap-3">
            <input
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            />

            <button
              onClick={createShortUrl}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Shorten"}
            </button>
          </div>
        </div>

        {/* URL LIST */}
        <section className="space-y-4">
          {urls.length === 0 && (
            <p className="text-center text-gray-400">No short URLs yet</p>
          )}

          {urls.map((url) => (
            <div
              key={url._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center hover:bg-white/10 transition"
            >
              <div className="max-w-[65%]">
                <p className="text-sm text-gray-400 truncate">{url.longUrl}</p>

                <a
                  href={`/${url.shortId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:underline"
                >
                  short.ly/{url.shortId}
                </a>

                {url.createdAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(url.createdAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <a
                  href={`/analytics/${url.shortId}`}
                  className="underline text-gray-300 hover:text-white"
                >
                  Analytics
                </a>

                <button
                  onClick={() => deleteUrl(url._id)}
                  disabled={deletingId === url._id}
                  className="text-red-400 hover:text-red-300 transition disabled:opacity-50"
                >
                  {deletingId === url._id ? "Deleting..." : "Delete"}
                </button>

                <div className="flex items-center gap-1 text-gray-300">
                  <MousePointerClick className="w-4 h-4" />
                  {url.visitHistory.length}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
