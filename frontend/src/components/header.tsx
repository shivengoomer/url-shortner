import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ---------------- HEADER ----------------
export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 px-8 py-3 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl">
        <Link to="/" className="text-lg font-semibold tracking-wide">
          ShortURL
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-300">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          {user && (
            <>
              <Link to="/shorten" className="hover:text-white transition">
                Shorten
              </Link>
              <Link to="/analytics" className="hover:text-white transition">
                Analytics
              </Link>
              <Link to="/profile" className="hover:text-white transition">
                Profile
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="hover:text-white transition">
                  Admin
                </Link>
              )}
            </>
          )}
          {user ? (
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm text-gray-400">{user.name}</span>
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
