import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function Topbar({ title }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const notifPath = user?.role === "ADMIN" ? "/admin/notifications" : "/faculty/notifications";

  return (
    <header className="
      h-15 px-6 py-3.5
      bg-white dark:bg-cardDark
      border-b border-border dark:border-borderDark
      flex items-center justify-between
      flex-shrink-0
    ">
      <div>
        {title && <h1 className="text-base font-semibold text-textMain dark:text-white">{title}</h1>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(notifPath)}
          className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Notifications"
        >
          <Bell size={18} className="text-textMuted dark:text-gray-400" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Toggle theme"
        >
          {theme === "light"
            ? <Moon size={18} className="text-textMuted" />
            : <Sun size={18} className="text-yellow-400" />
          }
        </button>
      </div>
    </header>
  );
}