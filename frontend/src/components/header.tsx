import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ---------------- HEADER ----------------
export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 px-4 lg:px-8 lg:gap-6 py-3 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl">
        <Link to="/" className="text-lg font-semibold tracking-wide">
          Clix
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-50">
          {user && (
            <>
              <Link
                to="/shorten"
                className={`hover:text-white transition ${
                  location.pathname === "/shorten"
                    ? "text-white font-semibold border-b-2 border-white pb-0.5"
                    : ""
                }`}
              >
                Shorten
              </Link>
              <Link
                to="/analytics"
                className={`hover:text-white transition ${
                  location.pathname === "/analytics"
                    ? "text-white font-semibold border-b-2 border-white pb-0.5"
                    : ""
                }`}
              >
                Analytics
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className={`hover:text-white transition ${
                    location.pathname === "/admin"
                      ? "text-white font-semibold border-b-2 border-white pb-0.5"
                      : ""
                  }`}
                >
                  Admin
                </Link>
              )}
            </>
          )}
          {user ? (
            <div className="flex items-center gap-3 ml-4">
              <Link to="/profile">
                <span className="text-sm font-semibold text-cyan-100 cursor-pointer">
                  {user.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 font-medium transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-4 px-4 py-1.5 rounded-full bg-white text-black font-medium hover:opacity-90 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
