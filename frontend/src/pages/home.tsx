import React from "react";
import { Link } from "react-router-dom";
import Aurora from "../components/background";
import { Link2, BarChart2, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import RotatingText from "../components/RotatingText";

const words = [
  "Your",
  "links",
  "deserve",
  "better",
  "than",
  "long,",
  "messy",
  "URLs.",
];

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Aurora />
      </div>

      <main className="relative z-10 px-6">
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="grid md:grid-cols-2 gap-14 max-w-6xl w-full items-center mt-20">
            <div>
              <h1 className="text-7xl md:text-7xl font-bold leading-tight tracking-tight mb-3">
                Clix <br />
                <span className="mt-0 pt-0 text-6xl text-gray-400">
                  Made{" "}
                  <RotatingText
                    texts={["Simple", "Easier"]}
                    className=" text-cyan-300 font-bold rounded-lg inline-block"
                    rotationInterval={3000}
                  />
                </span>
              </h1>

              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                Shorten links, track engagement, and share smarter — all in one
                workspace.
              </p>

              <Link
                to="/shorten"
                className="relative inline-flex items-center justify-center px-7 py-3 rounded-xl font-medium text-white border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute w-3 h-3 bg-white rounded-full animate-dot-run" />
              </Link>
            </div>

            <div>
              <motion.h2 className="text-2xl md:text-2xl font-semibold tracking-tight text-center mb-5 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent flex flex-wrap justify-center gap-1">
                {words.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: i * 0.07 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h2>

              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 shadow-xl">
                <label className="text-gray-300 text-sm mb-2 block">
                  Paste Long URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/very/long/url"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-white/30 focus:outline-none placeholder-gray-500"
                />
                <Link to="/shorten">
                  <button className="w-full mt-4 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition">
                    Shorten URL
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 mb-28 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Tools Built for Modern Sharing
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto mb-14">
            Create short links, measure performance, and organize everything
            from one interface.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Link2 strokeWidth={1.75} className="w-5 h-5" />}
              title="Shorten Links"
              desc="Generate clean, shareable URLs built for clarity and speed."
            />

            <FeatureCard
              icon={<BarChart2 strokeWidth={1.75} className="w-5 h-5" />}
              title="Track Analytics"
              desc="Monitor clicks, device types, and engagement in real time."
            />

            <FeatureCard
              icon={<LayoutGrid strokeWidth={1.75} className="w-5 h-5" />}
              title="Unified Dashboard"
              desc="Manage and organize your links from a single workspace."
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:border-white/20 transition duration-300">
    <div className="flex items-center gap-3 mb-3 p-2">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm text-left leading-relaxed">{desc}</p>
  </div>
);
