import React, { useState } from "react";
import { apiRequest } from "../api";

type Preview = {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  siteName?: string | null;
  favicon?: string | null;
};

const LinkPreview: React.FC<{ url: string }> = ({ url }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Preview | null>(null);

  const load = async () => {
    if (data || loading) return;
    setLoading(true);
    setError(null);

    try {
      const json = await apiRequest(
        `/url/preview?url=${encodeURIComponent(url)}`,
      );
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next) await load();
  };

  return (
    <div className="mt-3">
      <button
        onClick={handleToggle}
        className="text-sm text-cyan-300 hover:underline"
      >
        {expanded ? "Hide preview" : "Show link preview"}
      </button>

      {expanded && (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/3 p-3 backdrop-blur-lg">
          {loading ? (
            <div className="text-gray-400">Loading preview…</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : data ? (
            <div className="flex gap-3">
              {data.image ? (
                <img
                  src={data.image}
                  className="w-20 h-20 rounded-md object-cover"
                />
              ) : (
                <img
                  src={data.favicon || ""}
                  className="w-10 h-10 rounded-md"
                />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {data.favicon && (
                    <img src={data.favicon} className="w-4 h-4 rounded" />
                  )}
                  <div className="font-semibold">
                    {data.title || data.siteName || url}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-300">
                  {data.description || "No description available."}
                </div>

                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-cyan-300"
                >
                  Visit original
                </a>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">No preview available.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LinkPreview;
