import React, { useState } from "react";
import { X, AlertTriangle, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BackendOfflinePopupProps {
  onDismiss: () => void;
}

export const BackendOfflinePopup: React.FC<BackendOfflinePopupProps> = ({
  onDismiss,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contactData = {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(
      localStorage.getItem("offline_contacts") || "[]",
    );
    localStorage.setItem(
      "offline_contacts",
      JSON.stringify([...existing, contactData]),
    );

    setSubmitted(true);
    setTimeout(onDismiss, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F19]/90 shadow-2xl"
        >
          {/* Close */}
          <button
            onClick={onDismiss}
            className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Service Temporarily Unavailable
                </h2>
                <p className="text-sm text-gray-400">
                  Backend is offline static content is available
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            {!submitted ? (
              <>
                <p className="mb-5 text-sm text-gray-400">
                  Some features may not work right now. Leave your details and
                  we’ll notify you once everything is back online.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#111827] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                  />

                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-[#111827] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                  />

                  <textarea
                    placeholder="Optional message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full resize-none rounded-lg border border-white/10 bg-[#111827] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-900 py-2.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                    Notify Me
                  </button>
                </form>

                <button
                  onClick={onDismiss}
                  className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-300"
                >
                  Continue without notifying
                </button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  You’re all set
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  We’ll reach out once the service is live.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
