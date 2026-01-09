import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../components/background";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        const { name, email, phone, password, confirmPassword } = form;

        if (!name || !email || !phone || !password || !confirmPassword) {
          setError("All fields are required");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        const data = await apiRequest("/user/new", {
          method: "POST",
          body: JSON.stringify({ name, email, phone, password }),
        });

        login(data.token, data.user);
      } else {
        const { email, password } = form;

        if (!email || !password) {
          setError("Email and password required");
          setLoading(false);
          return;
        }

        const data = await apiRequest("/user/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        login(data.token, data.user);
      }

      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeySubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-6 py-12 relative">
      <div className="fixed inset-0 z-0">
        <Aurora />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mt-12 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] hover:border-white/20 transition-all duration-300">
          <h1 className="text-2xl font-bold text-center  text-white">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <div className="text-center mb-8 mt-0">
            <p className="text-gray-400 text-sm mt-0">
              {isSignup
                ? "Start shortening your links today"
                : "Sign in to your account"}
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  placeholder="John Doe"
                  onChange={handleChange}
                  onKeyDown={handleKeySubmit}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                onKeyDown={handleKeySubmit}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  onChange={handleChange}
                  onKeyDown={handleKeySubmit}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={handleChange}
                  onKeyDown={handleKeySubmit}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-1 rounded"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={handleChange}
                    onKeyDown={handleKeySubmit}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 pr-20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-1 rounded"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                Processing...
              </span>
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-400">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSignup(!isSignup)}
            className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-200"
          >
            {isSignup ? "Sign In Instead" : "Create Account"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
