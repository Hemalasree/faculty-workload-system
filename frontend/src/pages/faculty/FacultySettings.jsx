import { Moon, Sun } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import React from "react";

export default function FacultySettings() {
  const { theme, toggleTheme } = useTheme();
  return (
    <DashboardLayout title="Settings">
      <div className="max-w-lg">
        <div className="card">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-textMain dark:text-white">Theme Mode</p>
              <p className="text-xs text-textMuted">Currently: {theme === "dark" ? "Dark" : "Light"} mode</p>
            </div>
            <button onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border dark:border-borderDark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {theme === "light" ? <Moon size={16}/> : <Sun size={16} className="text-yellow-400"/>}
              <span className="text-sm">Toggle {theme === "light" ? "Dark" : "Light"}</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}