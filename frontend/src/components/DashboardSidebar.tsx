/* Spec §10 — Dashboard Sidebar
   Width 230px desktop, collapses to horizontal tab strip below 920px.
   bg paper, right border line, user block top, nav links with active state. */

import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface SidebarLink {
  icon: string;
  label: string;
  to: string;
}

interface DashboardSidebarProps {
  variant?: "student" | "admin";
}

const studentLinks: SidebarLink[] = [
  { icon: "▤", label: "Overview",        to: "/dashboard" },
  { icon: "🎓", label: "My courses",     to: "/dashboard/courses" },
  { icon: "◆", label: "Certificates",   to: "/dashboard/certificates" },
];

const adminLinks: SidebarLink[] = [
  { icon: "▦", label: "Overview",     to: "/admin" },
  { icon: "▤", label: "Courses",      to: "/admin/courses" },
  { icon: "◍", label: "Students",     to: "/admin/students" },
];

const accountLinks: SidebarLink[] = [
  { icon: "⚙", label: "Settings", to: "#" },
];

const DashboardSidebar = ({ variant = "student" }: DashboardSidebarProps) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const links = variant === "admin" ? adminLinks : studentLinks;

  const isActive = (to: string) =>
    to === location.pathname || (to !== "/dashboard" && to !== "/admin" && location.pathname.startsWith(to));

  const NavLink = ({ icon, label, to }: SidebarLink) => (
    <Link
      to={to}
      className={`
        flex items-center gap-[10px] px-3 py-[10px] rounded-sm text-[13.5px] mb-[3px] transition-colors duration-[120ms]
        ${isActive(to)
          ? "bg-axiom-tint text-axiom [&_.side-icon]:text-axiom"
          : "text-t2 hover:bg-paper-sunken hover:text-ink [&_.side-icon]:text-t3"}
      `}
    >
      <span className="side-icon w-4 text-center text-[14px] shrink-0">{icon}</span>
      {label}
    </Link>
  );

  return (
    <aside
      className="
        bg-paper border-r border-line p-5 px-3
        w-[230px] shrink-0
        /* mobile: horizontal tab strip */
        max-[920px]:w-full max-[920px]:flex max-[920px]:overflow-x-auto max-[920px]:border-r-0 max-[920px]:border-b max-[920px]:p-[10px] max-[920px]:gap-1
      "
      aria-label="Dashboard navigation"
    >
      {/* User block — hidden on mobile strip */}
      <div className="px-[10px] pb-[18px] border-b border-line mb-4 flex gap-[10px] items-center max-[920px]:hidden">
        <div className="w-9 h-9 rounded-pill flex items-center justify-center text-sm font-bold bg-gradient-to-br from-axiom to-d-design text-white shrink-0">
          {user?.name?.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div>
          <b className="text-[13.5px] font-semibold text-ink block">{user?.name ?? "—"}</b>
          <span className="font-mono text-[11px] text-t3 capitalize">{user?.role ?? ""}</span>
        </div>
      </div>

      {/* Primary links */}
      {links.map((link) => (
        <NavLink key={link.to} {...link} />
      ))}

      {/* Account section — hidden on mobile */}
      <div className="max-[920px]:hidden">
        <div className="font-mono text-[10.5px] text-t3 uppercase tracking-[0.03em] px-3 pt-4 pb-[6px]">
          Account
        </div>
        {accountLinks.map((link) => (
          <NavLink key={link.label} {...link} />
        ))}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
