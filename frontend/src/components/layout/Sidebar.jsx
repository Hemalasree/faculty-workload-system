import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, Users, BookOpen, Building2, ClipboardList,
  BarChart3, CalendarDays, FileText, Bell,
  User, Briefcase, Clock, CalendarCheck, MessageSquare, LogOut
} from "lucide-react";
import React from "react";

const adminNav = [
  { to: "/admin",              label: "Dashboard",      icon: LayoutDashboard },
  { to: "/admin/faculty",      label: "Faculty",        icon: Users },
  { to: "/admin/subjects",     label: "Subjects",       icon: BookOpen },
  { to: "/admin/departments",  label: "Departments",    icon: Building2 },
  { to: "/admin/allocate",     label: "Allocate",       icon: ClipboardList },
  { to: "/admin/workload",     label: "Workload",       icon: BarChart3 },
  { to: "/admin/requests",     label: "Requests",       icon: MessageSquare },
  { to: "/admin/notifications",label: "Notifications",  icon: Bell },
  { to: "/admin/reports",      label: "Reports",        icon: FileText },
];

const facultyNav = [
  { to: "/faculty",              label: "Dashboard",    icon: LayoutDashboard },
  { to: "/faculty/profile",      label: "Profile",      icon: User },
  { to: "/faculty/subjects",     label: "Subjects",     icon: BookOpen },
  { to: "/faculty/workload",     label: "Workload",     icon: BarChart3 },
  { to: "/faculty/leave",        label: "Leave",        icon: CalendarCheck },
  { to: "/faculty/requests",     label: "Requests",     icon: MessageSquare },
  { to: "/faculty/notifications",label: "Notifications",icon: Bell },
  { to: "/faculty/reports",      label: "Reports",      icon: FileText },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const nav = user?.role === "ADMIN" ? adminNav : facultyNav;

  return (
    <aside className="
      w-64 h-screen flex flex-col
      bg-sideLight dark:bg-sideDark
      border-r border-border dark:border-borderDark
      overflow-y-auto flex-shrink-0
    ">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border dark:border-borderDark">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Briefcase size={16} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm text-textMain dark:text-white leading-tight">FacultyWork</p>
            <p className="text-[10px] text-textMuted dark:text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin" || to === "/faculty"}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-border dark:border-borderDark">
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl bg-white/40 dark:bg-white/5">
          <div className="w-8 h-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-textMain dark:text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-textMuted dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="nav-link w-full text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}