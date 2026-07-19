import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  MessageSquareText,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Resume", path: "/resume", icon: FileText },
  { label: "Interviews", path: "/interview/setup", icon: MessageSquareText },
  { label: "Profile", path: "/profile", icon: User },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-surface/80 backdrop-blur-xl border-r border-border flex flex-col p-4 sticky top-0">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-primary-dark flex items-center justify-center shadow-md shadow-primary/30">
          <Sparkles size={16} className="text-white" />
        </div>
        <h2 className="text-text-primary text-lg font-bold tracking-tight">
          InterviewIQ
        </h2>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path}>
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: isActive ? 0 : 3 }}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-linear-to-r from-primary to-primary-dark rounded-lg shadow-md shadow-primary/25"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon size={17} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border pt-4">
        <motion.div
          whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.05)" }}
          className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg cursor-default"
        >
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-primary/25 shrink-0">
            {user?.fullName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-text-primary text-sm font-medium truncate">
              {user?.fullName}
            </p>
            <p className="text-text-secondary text-xs truncate">
              {user?.email}
            </p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ x: 2 }}
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-danger text-sm font-medium hover:bg-danger/10 transition-colors"
        >
          <LogOut size={15} />
          Logout
        </motion.button>
      </div>
    </aside>
  );
}
