import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link2, BarChart2 } from "lucide-react";
import { motion } from "framer-motion";
import RotatingText from "../components/RotatingText";
import CardSwap, { Card } from "../components/CardSwap";
import SoftAurora from "@/components/SoftAurora";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

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
  const navigate = useNavigate();
  const [demoUrl, setDemoUrl] = useState("");

  const handleTryItOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoUrl.trim()) return;
    // Redirect to shorten page with intended URL in state
    navigate("/shorten", { state: { intendedUrl: demoUrl } });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
        <SoftAurora
          speed={0.4}
          scale={2.6}
          brightness={0.8}
          color1="#f7f7f7"
          color2="#e100ff"
          noiseFrequency={2.5}
          noiseAmplitude={1}
          bandHeight={0.5}
          bandSpread={1}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1}
          enableMouseInteraction
          mouseInfluence={0.25}
        />{" "}
      </div>

      <div className="pointer-events-none absolute top-[-100px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[140px]" />

      <main className="relative z-10">
        {/* HERO */}
        <section
          id="main"
          className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 pt-32 pb-20 sm:pt-35 sm:pb-24"
        >
          <div className="grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
            {/* LEFT */}
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-xl">
                <img src="/clix-img.png" alt="logo" className="h-6 w-6" />
                <span className="text-sm text-zinc-300">
                  Modern URL Management Platform
                </span>
              </div>

              <h1 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  Share Links
                </span>
                <br />
                <span className="text-zinc-400 text-4xl sm:text-5xl lg:text-6xl">Like a Pro.</span>
              </h1>

              <div className="mt-6 flex items-center gap-3 text-xl font-semibold text-zinc-300 sm:text-2xl">
                Made
                <RotatingText
                  texts={["Simple", "Faster", "Smarter"]}
                  className="rounded-xl bg-cyan-400/10 px-3 py-1.5 font-bold text-cyan-300 backdrop-blur-lg"
                  rotationInterval={2500}
                />
              </div>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
                Shorten links, track engagement, monitor analytics, and organize
                everything from one beautiful workspace designed for modern
                creators and developers.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/shorten"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-cyan-500 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]"
                >
                  <span className="relative z-10 text-sm">Get Started</span>
                  <span className="absolute inset-0 bg-white/20 opacity-0 transition duration-300 group-hover:opacity-100" />
                </Link>
                <a
                  href="#features"
                  className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-medium text-zinc-300 backdrop-blur-xl transition hover:bg-white/10 text-sm"
                >
                  Explore Features
                </a>
              </div>

              <motion.div className="mt-10 flex flex-wrap gap-2 text-sm font-medium text-zinc-600">
                {words.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.06 }}
                    className="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 backdrop-blur-xl"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* RIGHT */}
            <div className="relative hidden lg:flex min-h-[600px] items-center justify-center overflow-visible">
              <div className="absolute h-[600px] w-[600px] rounded-full bg-cyan-400/5 blur-[180px]" />

              {/* Wrapper sized to front card + vertical room for back cards stacking up */}
              <div
                style={{
                  position: "relative",
                  width: "440px",
                  height: "520px",
                }}
              >
                <CardSwap
                  cardDistance={50}
                  verticalDistance={60}
                  delay={4000}
                  pauseOnHover={false}
                >
                  {/* CARD 1 — Analytics */}
                  <Card>
                    <div className="w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#070B1A] shadow-[0_0_60px_rgba(0,0,0,0.4)] ">
                      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                        <p className="text-lg font-medium text-zinc-200">
                          Analytics Overview
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                              Total Clicks
                            </p>
                            <h2 className="mt-1 text-5xl font-black text-white">
                              18.2K
                            </h2>
                          </div>
                          <div className="rounded-2xl bg-cyan-400/10 p-4 text-3xl">
                            📈
                          </div>
                        </div>
                        <div className="mt-8 flex h-36 items-end gap-2.5">
                          {[30, 60, 45, 80, 50, 95, 75].map((v, i) => (
                            <div
                              key={i}
                              style={{ height: `${v}%` }}
                              className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-500 to-cyan-300"
                            />
                          ))}
                        </div>
                        <div className="mt-6 flex items-center justify-between rounded-xl bg-white/5 p-4">
                          <div>
                            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                              Conversion Rate
                            </p>
                            <h4 className="mt-1 text-xl font-bold text-white">
                              74.8%
                            </h4>
                          </div>
                          <span className="rounded-full bg-green-400/10 px-3 py-1.5 text-xs font-bold text-green-400">
                            +12%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* CARD 2 — URL Generator */}
                  <Card>
                    <div className="w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#070B1A] shadow-[0_0_60px_rgba(0,0,0,0.4)] ">
                      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-purple-300" />
                        <p className="text-lg font-medium text-zinc-200">
                          Smart URL Generator
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Original URL</p>
                          <p className="mt-2 truncate text-zinc-300 text-sm">
                            https://myportfolio.com/fullstack-dashboard-case-study
                          </p>
                          <div className="my-5 h-px bg-white/10" />
                          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Short URL</p>
                          <div className="mt-2 flex items-center justify-between rounded-xl bg-cyan-400/10 px-4 py-3">
                            <span className="font-semibold text-cyan-300 text-sm">
                              clix.vercel.app/ai24x
                            </span>
                            <button className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/20">
                              Copy
                            </button>
                          </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <div className="rounded-xl bg-white/5 p-4">
                            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                              Active Links
                            </p>
                            <h3 className="mt-1 text-3xl font-black text-white">
                              142
                            </h3>
                          </div>
                          <div className="rounded-xl bg-white/5 p-4">
                            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Engagement</p>
                            <h3 className="mt-1 text-3xl font-black text-cyan-300">
                              98%
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* CARD 3 — Active Users */}
                  <Card>
                    <div className="w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#070B1A] shadow-[0_0_60px_rgba(0,0,0,0.4)] ">
                      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-pink-300" />
                        <p className="text-lg font-medium text-zinc-200">
                          Active Users
                        </p>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Live Users</p>
                            <h2 className="mt-1 text-5xl font-black text-white">
                              1,284
                            </h2>
                          </div>
                          <div className="flex -space-x-2.5">
                            {[
                              "https://i.pravatar.cc/100?img=1",
                              "https://i.pravatar.cc/100?img=2",
                              "https://i.pravatar.cc/100?img=3",
                            ].map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                className="h-11 w-11 rounded-full border-2 border-black object-cover"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="mt-8 rounded-2xl bg-cyan-400/10 p-5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-300">
                              Avg Session Time
                            </span>
                            <span className="font-bold text-cyan-300">
                              4m 28s
                            </span>
                          </div>
                          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-[78%] rounded-full bg-cyan-400" />
                          </div>
                        </div>
                        <div className="mt-6 space-y-3">
                          {[
                            ["India", "42%"],
                            ["United States", "31%"],
                            ["Germany", "18%"],
                          ].map(([country, percent]) => (
                            <div key={country}>
                              <div className="mb-1.5 flex items-center justify-between text-xs">
                                <span className="text-zinc-400 font-medium">{country}</span>
                                <span className="font-semibold text-white">
                                  {percent}
                                </span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                <div
                                  style={{ width: percent }}
                                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </CardSwap>
              </div>
            </div>
          </div>
        </section>

        {/* TRY IT OUT (REVERSE LAYOUT) */}
        <section className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-8 md:p-14 backdrop-blur-3xl shadow-[0_0_80px_rgba(34,211,238,0.05)]">
            {/* Background effects */}
            <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[150px]" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[150px]" />

            <div className="relative z-10 flex flex-col items-center gap-12 lg:flex-row-reverse">
              {/* RIGHT in DOM (Left visually due to row-reverse) - The Text */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-400/10 px-3.5 py-1.5 backdrop-blur-xl">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                    Interactive Demo
                  </span>
                </div>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  See the Magic.
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
                    Give it a Try.
                  </span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-zinc-400">
                  Drop a messy, long URL below and watch it transform into a
                  clean, trackable link instantly. Experience the speed and
                  simplicity of our modern platform firsthand.
                </p>
                <div className="mt-8 flex justify-center lg:justify-start">
                  <Link
                    to="/shorten"
                    className="group flex items-center gap-2.5 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-105"
                  >
                    Start Creating
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* LEFT in DOM (Right visually due to row-reverse) - The Card */}
              <div className="w-full max-w-md flex-1">
                <div className="relative rounded-[2rem] border border-white/10 bg-[#070B1A]/80 p-6 shadow-2xl backdrop-blur-2xl">
                  <div className="absolute -top-3 -right-2 rounded-full bg-cyan-500 px-3 py-1 text-[10px] font-bold text-white shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                    Generated!
                  </div>

                  {/* Short URL (Output) Displayed FIRST (In Reverse) */}
                  <div className="group relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5 transition-all hover:bg-cyan-400/20">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-[40px] transition-all group-hover:bg-cyan-400/40" />
                    <div className="relative z-10">
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        </svg>
                        Your New Short Link
                      </p>
                      <div className="mt-3 flex items-center justify-between rounded-xl bg-black/40 p-1.5 pl-3">
                        <span className="text-lg font-bold text-white">
                          clix.works/magic
                        </span>
                        <button className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Connector (Arrow pointing UP since logic is reversed) */}
                  <div className="relative my-3 flex justify-center">
                    <div className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-cyan-500/50 to-white/10" />
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#070B1A] text-cyan-400 shadow-xl">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="rotate-180"
                      >
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Long URL (Input) Displayed SECOND (In Reverse) */}
                  <form
                    onSubmit={handleTryItOut}
                    className="rounded-2xl border border-white/5 bg-white/5 p-5"
                  >
                    <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      Original Long URL
                    </p>
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-black/40 px-4 py-3 border border-white/5 focus-within:border-cyan-500/50 transition-colors">
                      <input
                        type="url"
                        required
                        placeholder="https://your-long-url.com/..."
                        className="w-full bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none pr-4"
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="flex h-7 w-7 items-center justify-center flex-shrink-0 rounded-full bg-cyan-500/20 text-cyan-400 transition hover:bg-cyan-500 hover:text-white"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="relative mx-auto max-w-7xl px-6 pt-32 pb-32"
        >
          {/* HEADING */}
          <div className="text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 backdrop-blur-xl">
              <div className="h-2 w-2 rounded-full bg-cyan-300" />
              <span className="text-sm font-medium text-cyan-200">
                Everything You Need
              </span>
            </div>

            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Built for
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-green-500 bg-clip-text text-transparent">
                {" "}
                Modern Sharing
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
              Smart analytics, QR generation, beautiful previews, and real-time
              insights — all crafted into one premium link management
              experience.
            </p>
          </div>

          {/* STACK CONTAINER */}
          <div className="relative mt-2 mb-10">
            <ScrollStack className="relative flex flex-col gap-15 ">
              {/* CARD 1 */}
              <ScrollStackItem>
                <div className="sticky top-24">
                  <div className=" relative grid h-[calc(100vh-140px)] min-h-[500px] max-h-[720px] relative rounded-[2.5rem] border border-white/10 bg-[#070B1A]/80 shadow-[0_0_120px_rgba(0,0,0,0.45)] backdrop-blur-3xl lg:grid-cols-2">
                    {/* LEFT */}
                    <div className="flex flex-col justify-center p-8 lg:p-12">
                      <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                        <Link2 className="h-4 w-4" />
                        Smart URL Shortening
                      </div>

                      <h3 className="text-4xl font-black leading-tight text-white sm:text-6xl">
                        Beautiful Links
                        <br />
                        Instantly.
                      </h3>

                      <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
                        Generate clean, branded, and trackable URLs with
                        real-time analytics, previews, and QR support built
                        directly into your workflow.
                      </p>

                      <div className="mt-1 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <p className="text-sm text-zinc-500">Original URL</p>

                        <div className="mt-3 truncate text-zinc-300">
                          https://myportfolio.com/fullstack-dashboard-case-study
                        </div>

                        <div className="my-5 h-px bg-white/10" />

                        <p className="text-sm text-zinc-500">Shortened URL</p>

                        <div className="mt-3 flex items-center justify-between rounded-2xl bg-cyan-400/10 px-5 py-4">
                          <span className="font-semibold text-cyan-300">
                            clix.vercel.app/ai24x
                          </span>

                          <button className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20">
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="relative flex items-center justify-center overflow-hidden p-10">
                      <div className="absolute h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[140px]" />

                      <div className="relative z-10 rounded-[36px] border border-white/10 bg-black/40 p-8 backdrop-blur-3xl">
                        <img
                          src="/screenshots/shorten-github.png"
                          alt="Shortener Preview"
                          className="w-full max-w-xl rounded-2xl border border-white/10 shadow-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
              {/* CARD 2 */}
              <ScrollStackItem>
                <div className="grid relative h-[calc(100vh-140px)] min-h-[500px] max-h-[720px] rounded-[2.5rem] border border-white/10 bg-[#070B1A]/80 shadow-[0_0_120px_rgba(0,0,0,0.45)] backdrop-blur-3xl lg:grid-cols-2 overflow-hidden">
                  {/* LEFT */}
                  <div className="relative flex items-center justify-center p-8 min-w-0">
                    <div className="absolute h-[450px] w-[450px] rounded-full bg-purple-500/20 blur-[120px]" />

                    <div className="relative z-10 rounded-[32px] border border-white/10 bg-black/40 p-8 backdrop-blur-2xl">
                      <div className="rounded-3xl bg-white p-6">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://clix.vercel.app/ai24x"
                          alt="QR"
                          className="rounded-2xl"
                        />
                      </div>

                      <div className="mt-6 flex items-center justify-between gap-4">
                        <button className="flex-1 rounded-2xl bg-cyan-500 px-5 py-3 font-medium text-white transition hover:scale-105 text-sm">
                          Download PNG
                        </button>

                        <button className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-zinc-300 transition hover:bg-white/10 text-sm whitespace-nowrap">
                          Copy Link
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col justify-center p-8 lg:p-12 min-w-0">
                    <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-purple-400/10 px-4 py-2 text-sm font-semibold text-purple-300">
                      QR + Smart Sharing
                    </div>

                    <h3 className="text-4xl font-black leading-tight text-white sm:text-6xl">
                      QR Codes
                      <br />
                      Built In.
                    </h3>

                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
                      Generate beautiful QR codes instantly for every shortened
                      link. Perfect for events, products, resumes, portfolios,
                      and campaigns.
                    </p>

                    <div className="mt-10 grid grid-cols-2 gap-5">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm text-zinc-500">QR Downloads</p>
                        <h4 className="mt-2 text-5xl font-black text-white">
                          12K
                        </h4>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm text-zinc-500">Scan Rate</p>
                        <h4 className="mt-2 text-5xl font-black text-cyan-300">
                          84%
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
              {/* CARD 3 */}
              <ScrollStackItem>
                <div className="sticky top-24">
                  <div className="relative grid h-[calc(100vh-140px)] min-h-[500px] max-h-[720px] rounded-[2.5rem] border border-white/10 bg-[#070B1A]/80 shadow-[0_0_120px_rgba(0,0,0,0.45)] backdrop-blur-3xl lg:grid-cols-2 overflow-hidden">
                    {/* LEFT */}
                    <div className="flex flex-col justify-center p-8 lg:p-12 min-w-0">
                      <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-300">
                        <BarChart2 className="h-4 w-4" />
                        Real-time Analytics
                      </div>

                      <h3 className="text-4xl font-black leading-tight text-white sm:text-6xl">
                        Powerful
                        <br />
                        Insights.
                      </h3>

                      <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
                        Track devices, clicks, traffic sources, countries,
                        engagement, and user activity with premium dashboards
                        and interactive charts.
                      </p>

                      <div className="mt-10 grid grid-cols-3 gap-4">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Clicks</p>
                          <h4 className="mt-1 text-3xl font-black text-white">
                            18.2K
                          </h4>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Links</p>
                          <h4 className="mt-1 text-3xl font-black text-white">
                            142
                          </h4>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">CTR</p>
                          <h4 className="mt-1 text-3xl font-black text-cyan-300">
                            74%
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="relative flex items-center justify-center p-8 lg:p-12 min-w-0">
                      <div className="absolute h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[140px]" />

                      <div className="relative z-10 w-full max-w-xl rounded-[2rem] border border-white/10 bg-black/40 p-6 sm:p-8 backdrop-blur-3xl">
                        <div className="flex h-56 items-end gap-3 lg:gap-4">
                          {[35, 55, 40, 70, 50, 90, 78].map((v, i) => (
                            <div
                              key={i}
                              style={{ height: `${v}%` }}
                              className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-500 to-cyan-300"
                            />
                          ))}
                        </div>

                        <div className="mt-8 space-y-3 lg:space-y-4">
                          {[
                            ["Google", "48%"],
                            ["Twitter", "24%"],
                            ["LinkedIn", "18%"],
                          ].map(([name, percent]) => (
                            <div key={name}>
                              <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="text-zinc-400">{name}</span>
                                <span className="font-semibold text-white">
                                  {percent}
                                </span>
                              </div>

                              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                <div
                                  style={{ width: percent }}
                                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            </ScrollStack>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full z-50 border-t border-zinc-800/80 bg-[#040405]/80 px-6 py-4 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <img
                src="/clix-img.png"
                alt="logo"
                className="h-5 w-5 opacity-90"
              />
              <span className="font-semibold tracking-tight">Clix</span>
            </div>
            <span className="hidden sm:inline-block">
              © {new Date().getFullYear()} Clix Inc. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how" className="transition hover:text-white">
              Workflow
            </a>
            <a
              href="https://github.com/shivengoomer/url-shortner"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="hidden sm:inline-block">Open Source</span>
            </a>
          </div>
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
    className={`flex flex-col items-center gap-12 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}
  >
    <div className="relative w-full md:w-1/2">
      <div className="absolute inset-0 rounded-3xl bg-cyan-400/20 blur-3xl" />
      <img
        src={img}
        alt={title}
        className="relative rounded-3xl border border-white/10 shadow-2xl"
      />
    </div>
    <div className="md:w-1/2">
      <h3 className="text-3xl font-black sm:text-5xl">{title}</h3>
      <p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-400">
        {text}
      </p>
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
  <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/30">
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-cyan-400/10 opacity-0 transition duration-500 group-hover:opacity-100" />
    <div className="relative z-10">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-4 leading-relaxed text-zinc-400">{desc}</p>
    </div>
  </div>
);
