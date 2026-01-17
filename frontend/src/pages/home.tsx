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
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden p-2 ">
      <div className="fixed inset-0 h-screen w-full z-0 pointer-events-none">
        <Aurora />
      </div>

      <main className="relative mt-0 z-10 px-4 sm:px-6">
        {/* HERO */}
        <section
          id="main"
          className="min-h-[calc(100vh-120px)] flex items-center justify-center"
        >
          <div className="grid md:grid-cols-2 gap-10 sm:gap-14 max-w-6xl w-full items-center mt-12 sm:mt-20">
            {/* LEFT */}
            <div>
              <div className="mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-2 text-8xl pt-4 sm:text-7xl md:text-8xl font-extrabold leading-tight tracking-tight ">
                    <img
                      src="/clix-img.png"
                      alt="Clix Logo"
                      className="pt-3 w-15 h-18 sm:w-14 sm:h-14 md:w-20 md:h-20"
                    />
                    Clix
                  </span>
                </div>

                <h2 className="text-4xl sm:text-3xl md:text-5xl text-gray-400 font-semibold mt-1 leading-snug">
                  Made{" "}
                  <RotatingText
                    texts={["Simple", "Easier"]}
                    className="text-cyan-300 font-bold rounded-lg inline-block"
                    rotationInterval={3000}
                  />
                </h2>
              </div>

              <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed max-w-md">
                Shorten links, track engagement, and share smarter — all in one
                workspace.
              </p>

              <Link
                to="/shorten"
                className="relative inline-flex items-center justify-center px-6 sm:px-7 py-3 rounded-xl font-medium text-white border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute w-3 h-3 bg-white rounded-full animate-dot-run" />
              </Link>
            </div>

            {/* RIGHT */}
            <div>
              <motion.h2 className="text-center mb-5 text-base sm:text-lg md:text-2xl font-semibold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent flex flex-wrap justify-center gap-1">
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

              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 sm:p-6 shadow-xl">
                <label className="text-gray-300 text-xs sm:text-sm mb-2 block">
                  Paste Long URL
                </label>

                <input
                  type="text"
                  placeholder="https://example.com/very/long/url"
                  className="w-full px-3 sm:px-4 py-3 text-sm sm:text-base rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-white/30 focus:outline-none placeholder-gray-500"
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

        {/* FEATURES */}
        <section
          id="features"
          className="mt-16 sm:mt-20 mb-16 sm:mb-28 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4">
            Tools Built for Modern Sharing
          </h2>

          <p className="text-gray-300 max-w-3xl italic text-base sm:text-lg mx-auto mb-10 sm:mb-14">
            Create short links, measure performance, and organize everything
            from one interface.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
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

        {/* HOW IT WORKS */}
        <section id="how" className="w-full py-6 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-8 sm:mb-12 leading-tight">
              How It Works
              <br />
              <span className="text-base sm:text-lg md:text-xl italic font-normal text-gray-300">
                From creation to analytics Clix provides complete control.
              </span>
            </h2>

            <div className="space-y-14 sm:space-y-20 pt-10 sm:pt-16">
              {/* Step 1 */}
              <Step
                img="/screenshots/shorten.png"
                title="1. Shorten"
                text="Paste a long URL, click shorten, and instantly get a clean, trackable link!"
                reverse={false}
              />

              {/* Step 2 */}
              <Step
                img="/screenshots/analytics.png"
                title="2. Manage URLs"
                text="View your shortened links, copy them, and track clicks in one place."
                reverse={true}
              />

              {/* Step 3 */}
              <Step
                img="/screenshots/dashboard.png"
                title="3. Dashboard + History"
                text="Dive into analytics — visit history, click counts, time info, and more."
                reverse={false}
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/10 bg-black/5 backdrop-blur-xl text-gray-300 py-8 mt-14">
        <div className="text-base sm:text-lg max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-6 sm:gap-10 md:gap-20 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/clix-img.png"
              alt="Clix Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 opacity-90"
            />
            <span className="text-lg font-semibold text-white">Clix</span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-6 sm:gap-10 text-sm sm:text-base">
            <a href="#main" className="hover:text-cyan-300 transition">
              Home
            </a>
            <a href="#features" className="hover:text-cyan-300 transition">
              Feature
            </a>
            <a href="#how" className="hover:text-cyan-300 transition">
              How
            </a>
            <a href="#" className="hover:text-cyan-300 transition">
              Contact
            </a>
          </div>

          {/* GitHub */}
          <a
            href="https://github.com/shivengoomer/url-shortner"
            className="hover:text-zinc-300 transition flex flex-row items-center gap-2"
          >
            <img
              className="h-6"
              src="https://img.icons8.com/?size=100&id=AZOZNnY73haj&format=png&color=000000"
            />
            <p className="font-black text-sm sm:text-base">
              Github <br />© {new Date().getFullYear()} Clix.
            </p>
          </a>
        </div>
      </footer>
    </div>
  );
};

const Step = ({
  img,
  title,
  text,
  reverse,
}: {
  img: string;
  title: string;
  text: string;
  reverse: boolean;
}) => (
  <div
    className={`flex flex-col ${
      reverse ? "md:flex-row-reverse" : "md:flex-row"
    } items-center gap-6 sm:gap-10`}
  >
    <img
      src={img}
      alt={title}
      className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
    />
    <div className="md:w-1/2 text-center md:text-left">
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
        {title}
      </h3>
      <p className="text-base sm:text-lg text-gray-300">{text}</p>
    </div>
  </div>
);

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 sm:p-6 rounded-2xl shadow-lg hover:border-white/20 transition duration-300">
    <div className="flex items-center gap-3 mb-3 p-1">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
    </div>
    <p className="text-zinc-300 text-xs sm:text-sm text-left leading-relaxed">
      {desc}
    </p>
  </div>
);
