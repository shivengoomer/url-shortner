import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { MousePointerClick, Trash2, BarChart2, Copy } from "lucide-react";
import { toast } from "sonner";

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
  const [activeDelete, setActiveDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUrls = async () => {
    try {
      const data = await apiRequest("/url", { auth: true });
      const items: Url[] = Array.isArray(data) ? data : [];

      setUrls(
        items.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime(),
        ),
      );
    } catch {
      setUrls([]);
    }
  };

  const createShortUrl = async () => {
    if (!longUrl.trim()) return;

    setLoading(true);
    try {
      const res = await apiRequest("/url", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ longUrl }),
      });
      setLongUrl("");

      if (res?.shortId) return navigate(`/analytics/${res.shortId}`);

      fetchUrls();
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      if (errorMessage.includes("URL limit reached")) {
        toast.error(
          "Maximum URL limit reached! You can only create up to 5 URLs.",
          {
            position: "top-right",
          },
        );
      } else {
        toast.error("Failed to create short URL. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUrl = async (id: string) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this URL?",
    );
    if (!shouldDelete) return;

    setActiveDelete(id);

    try {
      await apiRequest(`/url/${id}`, { method: "DELETE", auth: true });
      toast.success("URL successfully deleted.", {
        position: "top-right",
      });
      fetchUrls();
    } finally {
      setActiveDelete(null);
    }
  };

  const copyShort = (shortId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${shortId}`);
    toast.success("Short URL copied to clipboard!", {
      position: "top-right",
    });
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 py-36">
      <div className="max-w-5xl mx-auto space-y-14">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Create Short Links
          </h1>
          <p className="text-gray-400 mt-2">
            Shorten, track & manage URLs instantly
          </p>
        </header>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl space-y-4">
          <input
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Paste a long URL (e.g. https://example.com)"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
          />

          <button
            onClick={createShortUrl}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </div>

        <section className="space-y-3">
          {urls.length === 0 && (
            <div className="text-center text-gray-500 py-16">
              No URLs yet — start shortening!
            </div>
          )}

          {urls.map((url) => {
            const short = `${window.location.hostname}/${url.shortId}`;
            return (
              <div
                key={url._id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/10 transition"
              >
                <div className="space-y-1 flex-1">
                  <p className="text-xs text-gray-400 truncate max-w-3xl">
                    {url.longUrl}
                  </p>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/${url.shortId}`}
                      target="_blank"
                      className="font-medium hover:underline"
                    >
                      {short}
                    </a>
                    <button onClick={() => copyShort(url.shortId)}>
                      <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
                    </button>
                  </div>

                  {url.createdAt && (
                    <p className="text-xs text-gray-500">
                      {new Date(url.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={() => navigate(`/analytics/${url.shortId}`)}
                    className="flex items-center gap-1 hover:text-white text-gray-300"
                  >
                    <BarChart2 className="w-4 h-4" /> Analytics
                  </button>

                  <div className="flex items-center gap-1 text-gray-300">
                    <MousePointerClick className="w-4 h-4" />
                    {url.visitHistory.length}
                  </div>

                  <button
                    onClick={() => deleteUrl(url._id)}
                    disabled={activeDelete === url._id}
                    className="text-red-400 hover:text-red-300 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
};
