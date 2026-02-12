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
  const [setIsFocused, isFocused] = useState("");

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
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full
          text-xs font-semibold bg-white/10 text-gray-200
          border border-white/20 hover:bg-white/20 hover:text-white transition"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  Custom short link
                </button>
              )}
            </div>

            {/* Input with glow */}
            <div className="relative">
              <input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10
        text-white placeholder:text-gray-500
        focus:ring-2 focus:ring-white/30 focus:border-white/20 focus:bg-black/60
        outline-none transition-all duration-300"
              />

              {/* glow effect */}
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10
        -z-10 blur-xl transition-opacity duration-300
        ${isFocused ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </div>

          {/* Custom Short ID */}
          {showCustomId && (
            <div className="space-y-4 bg-black/40 border border-white/15 rounded-2xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
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
              <div className="relative group">
                <div
                  className={`flex items-baseline gap-1 px-4 py-3 rounded-xl border transition-all duration-200
          ${
            shortIdError
              ? "bg-red-500/10 border-red-500/50"
              : customShortId.length >= 5 && customShortId.length <= 7
                ? "bg-green-500/10 border-green-500/50"
                : "bg-black/50 border-white/10 group-focus-within:border-white/30"
          }`}
                >
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {typeof window !== "undefined"
                      ? window.location.hostname
                      : "domain"}
                    /
                  </span>

                  <input
                    value={customShortId}
                    maxLength={7}
                    onChange={(e) => {
                      const value = e.target.value.replace(
                        /[^a-zA-Z0-9_-]/g,
                        "",
                      );
                      setCustomShortId(value);

                      if (!value) {
                        setShortIdError("");
                        return;
                      }

                      if (value.length < 5 || value.length > 7) {
                        setShortIdError("Short ID must be 5–7 characters");
                      } else {
                        setShortIdError("");
                      }
                    }}
                    placeholder="my-link"
                    className="flex-1 bg-transparent outline-none text-white tracking-wide placeholder:text-gray-600"
                  />

                  <span
                    className={`text-xs font-mono ${
                      customShortId.length === 0
                        ? "text-gray-600"
                        : customShortId.length < 5 || customShortId.length > 7
                          ? "text-red-400"
                          : "text-green-400"
                    }`}
                  >
                    {customShortId.length}/7
                  </span>
                </div>

                {/* progress bar */}
                {customShortId && (
                  <div
                    className={`absolute -bottom-0.5 left-4 h-0.5 rounded-full transition-all duration-300
            ${
              customShortId.length < 5
                ? "bg-blue-400"
                : customShortId.length > 7
                  ? "bg-red-400"
                  : "bg-green-400"
            }`}
                    style={{ width: `${(customShortId.length / 7) * 100}%` }}
                  />
                )}
              </div>

              {/* Helper row */}
              <div className="flex items-center justify-between text-xs">
                <p className="text-gray-500">
                  Letters, numbers, <code>-</code> or <code>_</code>
                </p>

                <span
                  className={`font-medium ${
                    customShortId.length === 0
                      ? "text-gray-500"
                      : customShortId.length < 5
                        ? "text-red-400"
                        : customShortId.length > 7
                          ? "text-red-400"
                          : "text-green-400"
                  }`}
                >
                  {customShortId.length === 0
                    ? "Optional"
                    : customShortId.length < 5
                      ? "Too short"
                      : customShortId.length > 7
                        ? "Too long"
                        : "Perfect ✓"}
                </span>
              </div>

              {shortIdError && (
                <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
                  ⚠️ {shortIdError}
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={createShortUrl}
            disabled={
              loading ||
              (!!customShortId &&
                (customShortId.length < 5 || customShortId.length > 7))
            }
            className="w-full px-4 py-3 rounded-xl font-semibold bg-white text-black
    hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-300"
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
