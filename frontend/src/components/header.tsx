import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link2, LogOut, User } from "lucide-react";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Workspace", path: "/shorten" },
    { name: "Analytics", path: "/analytics" },
  ];

  if (user?.role === "admin") {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="flex h-14 items-center justify-between px-3 lg:px-4 rounded-full bg-[#09090b]/70 backdrop-blur-2xl border border-zinc-800/80 shadow-2xl">
        {/* Logo & Primary Nav */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/" className="flex items-center gap-2.5 group pl-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-sm group-hover:bg-zinc-200 transition-colors">
              <img src="/clix-img.png" alt="logo" className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:block">
              Clix
            </span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 pr-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <span className="hidden sm:inline-block">{user.name}</span>
              </Link>

              <div className="h-4 w-px bg-zinc-800 hidden sm:block"></div>

              <button
                onClick={handleLogout}
                className="text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline-block">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pr-1">
              <Link
                to="/login"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-zinc-800/40"
              >
                Log in
              </Link>
              <Link
                to="/auth"
                className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
