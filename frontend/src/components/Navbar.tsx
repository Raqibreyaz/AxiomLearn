import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, LogOut, Menu, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const isInstructor = user?.role === "instructor" || user?.role === "admin" || user?.role === "owner";

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      navigate("/");
    },
  });

  const navLinks = [
    { label: "Courses", to: "/courses" },
    ...(user ? [{ label: "Dashboard", to: "/dashboard" }] : []),
    ...(isInstructor ? [{ label: "Create Course", to: "/instructor/create-course" }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            id="navbar-logo"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-axiom to-d-design">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">AxiomLearn</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to) ? "text-axiom bg-axiom-tint" : "text-t2 bg-transparent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-axiom-tint text-axiom">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium leading-none text-ink">
                      {user.name}
                    </p>
                    <p className="text-xs mt-0.5 capitalize text-t3">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button
                  id="navbar-logout-btn"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-80 cursor-pointer text-t2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  id="navbar-login-link"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-t2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  id="navbar-signup-link"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 bg-axiom hover:bg-axiom-hover"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="navbar-mobile-toggle"
            className="md:hidden p-2 rounded-lg transition-colors duration-200 cursor-pointer text-t2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 border-t border-line">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to) ? "text-axiom bg-axiom-tint" : "text-t2 bg-transparent"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => { logoutMutation.mutate(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-left text-t2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-center text-t2">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white text-center bg-axiom hover:bg-axiom-hover">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
