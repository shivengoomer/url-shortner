import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link2, LogOut, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Workspace", path: "/shorten" },
    { name: "Analytics", path: "/analytics" },
  ];

  if (user?.role === "admin") {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="flex h-14 items-center justify-between px-3 lg:px-4 rounded-full bg-[#09090b]/70 backdrop-blur-2xl border border-zinc-800/80 shadow-2xl relative z-50">
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
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive
                      ? "bg-zinc-800/80 text-white"
                      : "text-zinc-200 hover:text-zinc-200 hover:bg-zinc-800/40"
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
            <div className="flex items-center gap-2 sm:gap-4 pr-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-zinc-200" />
                </div>
                <span className="hidden sm:inline-block">{user.name}</span>
              </Link>

              <div className="h-4 w-px bg-zinc-800 hidden md:block"></div>

              <button
                onClick={handleLogout}
                className="text-zinc-500 hover:text-red-400 transition-colors hidden md:flex items-center gap-2 text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 text-zinc-200 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pr-1">
              <Link
                to="/login"
                className="text-sm font-medium bg-white/80 rounded-full text-black hover:text-white transition-colors px-3 py-1.5 hover:bg-zinc-800/40"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-16 right-0 w-48 md:hidden"
          >
            <div className="rounded-2xl bg-[#09090b]/95 backdrop-blur-2xl border border-zinc-800/80 shadow-2xl overflow-hidden">
              <div className="flex flex-col p-1.5 gap-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                        ? "bg-zinc-800/80 text-white"
                        : "text-zinc-200 hover:text-zinc-200 hover:bg-zinc-800/40"
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <div className="h-px bg-zinc-800/50 my-1 mx-2"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <span>Sign Out</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
