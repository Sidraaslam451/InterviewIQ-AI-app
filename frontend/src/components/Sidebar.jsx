import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Resume", path: "/resume" },
  { label: "Interviews", path: "/interview/setup" },
  { label: "Profile", path: "/profile" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-border flex flex-col p-4">
      <h2 className="text-text-primary text-xl font-semibold mb-8 px-2">
        InterviewIQ
      </h2>

      <nav className="flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded mb-1 text-sm ${
                isActive
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-bg"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border pt-4">
        <p className="text-text-primary text-sm font-medium">{user?.fullName}</p>
        <p className="text-text-secondary text-xs mb-3">{user?.email}</p>
        <button
          onClick={logout}
          className="text-danger text-sm hover:underline"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}