import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import {
  MousePointerClick,
  Trash2,
  BarChart2,
  Copy,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { confirmDelete } from "../utils/confirmDelete";

interface Url {
  _id: string;
  longUrl: string;
  shortId: string;
  visitHistory: { timestamp: number }[];
  createdAt?: string;
}

export const ShortUrlPage: React.FC = () => {
  const [longUrl, setLongUrl] = useState("");
  const [showCustomId, setShowCustomId] = useState(false);
  const [customShortId, setCustomShortId] = useState("");
  const [shortIdError, setShortIdError] = useState("");
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeDelete, setActiveDelete] = useState<string | null>(null);
  const isDuplicateShortIdError = (msg: string) =>
    msg.toLowerCase().includes("taken") ||
    msg.toLowerCase().includes("exists") ||
    msg.toLowerCase().includes("duplicate");

  const navigate = useNavigate();

  /* ---------------- Fetch URLs ---------------- */
  const fetchUrls = async () => {
    try {
      const data = await apiRequest("/url", { auth: true });
      setUrls(
        Array.isArray(data)
          ? data.sort(
              (a, b) =>
                new Date(b.createdAt || "").getTime() -
                new Date(a.createdAt || "").getTime(),
            )
          : [],
      );
    } catch {
      setUrls([]);
    }
  };

  /* ---------------- Create URL ---------------- */
  const createShortUrl = async () => {
    if (!longUrl.trim()) return;

    if (
      customShortId &&
      (customShortId.length < 5 || customShortId.length > 7)
    ) {
      toast.error("Custom short ID must be 5–7 characters");
      return;
    }

    setLoading(true);
    try {
      const payload: any = { longUrl };
      if (customShortId) payload.customShortId = customShortId;

      const res = await apiRequest("/url", {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      });

      setLongUrl("");
      setCustomShortId("");

      if (res?.shortId) navigate(`/analytics/${res.shortId}`);
      else fetchUrls();
    } catch (err: any) {
      const msg = err?.message || "";
      if (isDuplicateShortIdError(msg)) {
        setShortIdError("This short ID already exists. Try a different one.");
        toast.error("Short ID already exists");
      } else if (msg.includes("limit")) {
        toast.error("URL limit reached (max 5)");
      } else {
        toast.error("Failed to create short URL");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Delete ---------------- */
  const deleteUrl = (id: string) => {
    confirmDelete(async () => {
      setActiveDelete(id);
      try {
        await apiRequest(`/url/${id}`, { method: "DELETE", auth: true });
        toast.success("URL deleted");
        fetchUrls();
      } finally {
        setActiveDelete(null);
      }
    });
  };

  /* ---------------- Copy ---------------- */
  const copyShort = (shortId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/${shortId}`);
    toast.success("Copied to clipboard");
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 py-32">
      <div className="max-w-5xl mx-auto space-y-14">
        {/* HEADER */}
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Shorten Your Links
          </h1>
          <p className="text-gray-400 mt-2">
            Create, customize & track short URLs
          </p>
        </header>

        {/* CREATE CARD */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl space-y-6">
          {/* Long URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-300">
                Long URL
              </label>

              {!showCustomId && (
                <button
                  onClick={() => setShowCustomId(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                     text-xs font-medium bg-white/10 text-gray-200
                     border border-white/20 hover:bg-white/20 hover:text-white transition"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Custom short link
                </button>
              )}
            </div>

            <input
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10
                 focus:ring-2 focus:ring-white/30 outline-none"
            />
          </div>

          {/* Custom Short ID */}
          {showCustomId && (
            <div
              className="space-y-3 bg-black/40 border border-white/15 rounded-2xl p-5
                    animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between">
                <label className="text-base font-medium text-gray-200">
                  Custom short ID
                </label>

                <button
                  onClick={() => {
                    setShowCustomId(false);
                    setCustomShortId("");
                    setShortIdError("");
                  }}
                  className="text-xs text-gray-400 hover:text-gray-200 transition"
                >
                  Remove
                </button>
              </div>

              {/* Input */}
              <div
                className={`flex items-center rounded-xl overflow-hidden border transition
          ${
            shortIdError
              ? "border-red-500/60 focus-within:ring-2 focus-within:ring-red-500/30"
              : "border-white/10 focus-within:ring-2 focus-within:ring-white/30"
          }
        `}
              >
                <span className="px-3 py-3 text-sm text-gray-400 bg-black/50 border-r border-white/10">
                  {window.location.hostname}/
                </span>

                <input
                  value={customShortId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z0-9_-]/g, "");
                    setCustomShortId(value);
                    setShortIdError("");

                    if (value && (value.length < 5 || value.length > 7)) {
                      setShortIdError("Short ID must be 5–7 characters");
                    }
                  }}
                  placeholder="my-link"
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-white tracking-wide"
                />
              </div>

              {/* Helper row */}
              <div className="flex items-center justify-between text-xs">
                <p className="text-gray-500">
                  Letters, numbers, <code>-</code> or <code>_</code>
                </p>

                <span
                  className={
                    customShortId.length === 0
                      ? "text-gray-500"
                      : customShortId.length < 5 || customShortId.length > 7
                        ? "text-red-400"
                        : "text-green-400"
                  }
                >
                  {customShortId.length}/7
                </span>
              </div>

              {shortIdError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  ⚠️ {shortIdError}
                </p>
              )}
            </div>
          )}

          <button
            onClick={createShortUrl}
            disabled={loading || !!shortIdError}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold
               hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Short URL"}
          </button>
        </div>

        {/* URL LIST */}
        <section className="space-y-3">
          {urls.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No URLs yet — create one above 🚀
            </p>
          )}

          {urls.map((url) => (
            <div
              key={url._id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-4 hover:bg-white/10 transition"
            >
              <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
                <p className="text-xs text-gray-400 break-all">{url.longUrl}</p>

                <div className="flex items-center gap-2 text-lg">
                  <a
                    href={`/${url.shortId}`}
                    target="_blank"
                    className="font-medium hover:underline break-all"
                  >
                    {window.location.hostname}/{url.shortId}
                  </a>
                  <button onClick={() => copyShort(url.shortId)}>
                    <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>

                {url.createdAt && (
                  <p className="text-[11px] text-gray-500">
                    {new Date(url.createdAt).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-300">
                <button
                  onClick={() => navigate(`/analytics/${url.shortId}`)}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <BarChart2 className="w-4 h-4" />
                  Analytics
                </button>

                <div className="flex items-center gap-1">
                  <MousePointerClick className="w-4 h-4" />
                  {url.visitHistory.length}
                </div>

                <button
                  onClick={() => deleteUrl(url._id)}
                  disabled={activeDelete === url._id}
                  className="text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
