import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import CircularText from "@/components/CircularText";
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;

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

        data = await apiRequest("/user/new", {
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

        data = await apiRequest("/user/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        login(data.token, data.user);
      }

      const userName =
        data.user?.profile?.firstName || data.user?.name || "there";
      toast.success(`Welcome back, ${userName}!`);
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Network error. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      {/* LEFT SIDE - Brand / Testimonial / Visual (Hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-zinc-800/50 bg-[#040405] p-10 lg:flex">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="flex-1 flex flex-col items-center justify-center relative z-10 min-h-[400px]">
          <CircularText
            text="HAPPY*TO*SEE*YOU*BACK*AT*CLIX*"
            onHover="goBonkers"
            spinDuration={35}
            className="w-[300px] h-[300px]"
          />
        </div>

        <div className="relative z-10 mt-auto max-w-lg">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl leading-snug mb-6">
            "The most robust and elegant link management platform we've ever
            integrated into our workflow."
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
              <img
                src="https://i.pravatar.cc/100?img=33"
                alt="Avatar"
                className="h-full w-full object-cover grayscale opacity-80"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Shiven Goomer</p>
              <p className="text-sm text-zinc-400">Me duhh!</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Form */}
      <div className="flex w-full flex-col justify-center px-6 pt-32 pb-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex lg:hidden justify-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-lg">
                <img src="/clix-img.png" alt="logo" className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Clix
              </span>
            </Link>
          </div>

          <div className="text-left mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              {isSignup ? "Create an account" : "Log in to your account"}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {isSignup
                ? "Enter your details below to get started"
                : "Enter your credentials to access your workspace"}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isSignup && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300">
                  Full Name
                </label>
                <input
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
            </div>

            {isSignup && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300">
                  Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">
                  Password
                </label>
                {!isSignup && (
                  <a
                    href="#"
                    className="text-xs text-zinc-500 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-500 pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-500 pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-zinc-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full flex items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin text-black"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : isSignup ? (
                "Create Account"
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
              className="font-medium text-white hover:underline focus:outline-none"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </div>

          {/* Footer Text */}
          <div className="mt-12 text-center text-xs text-zinc-600">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="hover:text-zinc-400 underline decoration-zinc-800 underline-offset-4"
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
};
