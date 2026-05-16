import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../api";
import {
  Link2,
  Trash2,
  Copy,
  ExternalLink,
  Zap,
  MousePointerClick,
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
  const location = useLocation();
  const [longUrl, setLongUrl] = useState(location.state?.intendedUrl || "");
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
      setShowCustomId(false);

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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white px-4 sm:px-6 pt-32 pb-20 sm:pt-40 sm:pb-32 relative">
      {/* Subtle grid pattern background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HEADER */}
        <header className="mb-8 border-b border-zinc-800/50 pb-8">
          <div className="inline-flex items-center justify-center p-3 bg-zinc-900 border border-zinc-800 rounded-2xl mb-4 shadow-sm gap-3">
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
              Workspace
            </h1>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
            Create new short links and manage your active campaigns.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: CREATE CARD */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#040405] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/50 space-y-8 sticky top-32">
              <h2 className="text-lg font-semibold text-white mb-2 border-b border-zinc-800/80 pb-4">
                Create New Link
              </h2>
              {/* Long URL */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                    Destination URL
                  </label>

                  {!showCustomId && (
                    <button
                      onClick={() => setShowCustomId(true)}
                      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <Link2 className="w-3 h-3" />
                      Custom alias
                    </button>
                  )}
                </div>

                <input
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://example.com/very/long/path"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:border-zinc-500 focus:bg-zinc-900 outline-none transition-colors"
                />
              </div>

              {/* Custom Short ID */}
              {showCustomId && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      Custom Alias
                    </label>

                    <button
                      onClick={() => {
                        setShowCustomId(false);
                        setCustomShortId("");
                        setShortIdError("");
                      }}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  <div
                    className={`flex items-center rounded-xl overflow-hidden border transition-colors bg-zinc-900/50 ${
                      shortIdError
                        ? "border-red-500/50 focus-within:border-red-500"
                        : "border-zinc-800 focus-within:border-zinc-500 focus-within:bg-zinc-900"
                    }`}
                  >
                    <span className="px-4 py-3 text-sm text-zinc-500 border-r border-zinc-800 font-medium">
                      {window.location.hostname}/
                    </span>
                    <input
                      value={customShortId}
                      onChange={(e) => {
                        setCustomShortId(e.target.value);
                        setShortIdError("");
                      }}
                      placeholder="my-link"
                      className="w-full px-3 py-3 bg-transparent text-sm outline-none text-white placeholder-zinc-600"
                    />
                  </div>

                  {shortIdError ? (
                    <p className="text-xs text-red-400 font-medium px-1">
                      {shortIdError}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-500 px-1">
                      Must be 5-7 characters. Leave blank for random.
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={createShortUrl}
                disabled={loading || !longUrl.trim()}
                className="w-full py-3.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99] mt-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-black"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Shorten URL"
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: RECENT LINKS */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-white">Recent Links</h2>
              <button
                onClick={() => navigate("/analytics")}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md"
              >
                View Analytics <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {urls.slice(0, 5).map((url) => (
                <div
                  key={url._id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#040405] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 hover:border-zinc-600 transition-colors shadow-sm"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-100 font-semibold truncate text-base">
                        {window.location.hostname}/
                        <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">
                          {url.shortId}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 max-w-full">
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{url.longUrl}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-3 sm:pt-0 border-t border-zinc-800 sm:border-0">
                    <div className="flex items-center gap-1.5 text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
                      <MousePointerClick className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">
                        {url.visitHistory.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyShort(url.shortId)}
                        className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
                        title="Copy Link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUrl(url._id)}
                        disabled={activeDelete === url._id}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                        title="Delete Link"
                      >
                        {activeDelete === url._id ? (
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {urls.length === 0 && !loading && (
                <div className="text-center py-16 border border-zinc-800 border-dashed rounded-3xl bg-[#040405]/50">
                  <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Link2 className="w-5 h-5 text-zinc-600" />
                  </div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-1">
                    No links created
                  </h3>
                  <p className="text-zinc-500 text-xs">
                    Your workspace is empty. Create a link to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
