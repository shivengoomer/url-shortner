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

        if (!name || !email || !phone || !password) {
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
        navigate("/");
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
        navigate("/");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white px-6 relative">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora />
      </div>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl flex flex-col gap-4">
          <h2 className="text-3xl font-bold mb-4 text-center">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>

          {/* Error */}
          {error && (
            <div className="mb-2 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {isSignup && (
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 transition"
              />
            )}

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 transition"
            />

            {isSignup && (
              <input
                name="phone"
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 transition"
              />
            )}

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 transition"
            />

            {isSignup && (
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 transition"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
          </button>

          {/* Toggle Signup/Login */}
          <p className="text-center text-gray-400 mt-4">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
            <span
              onClick={() => setIsSignup(!isSignup)}
              className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer transition"
            >
              {isSignup ? "Login" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
