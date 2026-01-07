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

        // Login user with token and data
        login(data.token, data.user);

        // Redirect to home
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

        // Login user with token and data
        login(data.token, data.user);

        // Redirect to home
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

      {/* Content */}
      <div className="relative z-10">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          {isSignup && (
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          />

          {isSignup && (
            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          )}

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          />

          {isSignup && (
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={handleChange}
              className="w-full mb-6 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
          </button>

          <p className="text-center text-gray-400 mt-6">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
            <span
              onClick={() => setIsSignup(!isSignup)}
              className="text-white hover:underline cursor-pointer"
            >
              {isSignup ? "Login" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
