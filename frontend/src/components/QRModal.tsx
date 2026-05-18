import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    QRCode?: any;
  }
}

type Props = {
  open: boolean;
  onClose: () => void;
  shortUrl: string;
};

const QRModal: React.FC<Props> = ({ open, onClose, shortUrl }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (!window.QRCode) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      script.async = true;
      script.onload = () => setLoaded(true);
      document.body.appendChild(script);
    } else {
      setLoaded(true);
    }

    return () => { };
  }, [open]);

  useEffect(() => {
    if (!open || !loaded || !containerRef.current) return;

    // clear
    containerRef.current.innerHTML = "";

    try {
      // @ts-ignore
      new window.QRCode(containerRef.current, {
        text: shortUrl,
        width: 200,
        height: 200,
      });
    } catch (e) {
      console.error(e);
    }
  }, [open, loaded, shortUrl]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    toast.success("Link Copied to clipboard")
  };

  const handleDownload = () => {
    if (!containerRef.current) return;
    const img = containerRef.current.querySelector(
      "img",
    ) as HTMLImageElement | null;
    const canvas = containerRef.current.querySelector(
      "canvas",
    ) as HTMLCanvasElement | null;
    const src = img?.src || (canvas && canvas.toDataURL("image/png"));
    if (!src) return;

    const a = document.createElement("a");
    a.href = src;
    a.download = "qrcode.png";
    a.click();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-[360px] rounded-xl bg-[#0b0b10]/90 border border-white/10 p-6 backdrop-blur-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">QR Code</h3>
          <button onClick={onClose} className="text-gray-400">
            ✕
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center">
          <div ref={containerRef} />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={async () => {
              await handleCopy();
            }}
            className="flex-1 rounded-lg bg-white/5 px-4 py-2 text-sm"
          >
            Copy Link
          </button>

          <button
            onClick={handleDownload}
            className="rounded-lg bg-white/5 px-4 py-2 text-sm"
          >
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
