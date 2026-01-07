import { Link } from "react-router-dom";
import { Header } from "../components/header";
import Aurora from "../components/background";
import DecryptedText from "../components/decryptingTxt";

// ---------------- HOME PAGE ----------------
export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 relative">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />

        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Short URLs <br />{" "}
                <span className="text-gray-400">Made Simple</span>
              </h1>
              <div style={{ marginTop: "1 rem" }}>
                <DecryptedText
                  speed={50}
                  text="This text animates when in view"
                  animateOn="view"
                  revealDirection="center"
                />
              </div>
              ; ;
              <p className="text-gray-400 mb-8">
                Shorten Your Links, Amplify Your Reach
                <br />
                Transform long URLs into clean, shareable links in seconds
              </p>
              <Link
                to="/login"
                className="inline-block px-8 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition"
              >
                Get Started
              </Link>
            </div>

            {/* Glass Card */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <p className="text-gray-300 mb-4">Paste your long URL</p>
              <input
                type="text"
                placeholder="https://example.com/very/long/url"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Link to="/shorten">
                <button className="w-full mt-4 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90">
                  Shorten URL
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
