/* Spec §1 — Global Header / Navigation
   Height 64px, bg --ink, sticky, container max-w 1200px. */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import Button, { GhostInkButton } from "./Button";

const navLinks = [
  { label: "Home",      to: "/" },
  { label: "Courses",   to: "/courses" },
];

/* Logo mark: 28×28 square, radius-sm, filled axiom, geometric glyph in bone */
const LogoMark = () => (
  <div className="w-7 h-7 rounded-sm bg-axiom flex items-center justify-center shrink-0">
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
      <path d="M12 3L20 19H4L12 3Z" stroke="#F0EEE6" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  </div>
);

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, clearUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === "admin";

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      navigate("/");
    },
  });

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const allLinks = [
    ...navLinks,
    ...(user ? [{ label: "Dashboard", to: "/dashboard" }] : []),
    ...(isAdmin ? [{ label: "Admin", to: "/admin" }] : []),
  ];

  return (
    <>
      {/* ── Header bar ── */}
      <header
        className="sticky top-0 z-[100] h-16 bg-ink border-b border-line-ink flex items-center"
        id="site-header"
      >
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-[9px] group" id="header-logo">
            <LogoMark />
            <span className="font-body font-semibold text-[17px] text-ti1 tracking-[-0.01em]">
              AxiomLearn
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {allLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`
                  text-[13.5px] relative pb-1 transition-colors duration-[120ms]
                  ${isActive(to)
                    ? "text-ti1 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-ti1"
                    : "text-ti2 hover:text-ti1"}
                `}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-[10px]">
            {user ? (
              <>
                <span className="font-mono text-[11.5px] text-ti3 mr-1">
                  {user.name.split(" ")[0]}
                </span>
                <GhostInkButton
                  size="md"
                  id="header-logout-btn"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "…" : "Log out"}
                </GhostInkButton>
              </>
            ) : (
              <>
                <GhostInkButton size="md" id="header-login-btn" onClick={() => navigate("/login")}>
                  Log in
                </GhostInkButton>
                <Button variant="primary" size="md" id="header-start-btn" onClick={() => navigate("/signup")}>
                  Start learning
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-ti2 hover:text-ti1 transition-colors p-1"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Open menu"
            id="header-mobile-menu"
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── slides from right, 280px, bg ink ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[99] md:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[280px] bg-ink border-l border-line-ink flex flex-col p-6 gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-4">
              <button className="text-ti2" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            {allLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-ti2 hover:text-ti1 text-[14px] py-2 border-b border-line-ink transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-auto flex flex-col gap-2 pt-4">
              {user ? (
                <Button
                  variant="ghost"
                  size="md"
                  block
                  onClick={() => { logoutMutation.mutate(); setDrawerOpen(false); }}
                >
                  Log out
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="md" block onClick={() => { navigate("/login"); setDrawerOpen(false); }}>
                    Log in
                  </Button>
                  <Button variant="primary" size="md" block onClick={() => { navigate("/signup"); setDrawerOpen(false); }}>
                    Start learning
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
