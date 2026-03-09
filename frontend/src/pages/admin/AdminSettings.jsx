import { useState } from "react";
import { Moon, Sun, Save } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/api";
import React from "react";

export default function AdminSettings() {
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const handleSave = async () => {
    if (form.password && form.password !== form.confirm) return toast.error("Passwords don't match");
    try {
      const payload = {};
      if (form.name)     payload.name = form.name;
      if (form.email)    payload.email = form.email;
      if (form.password) payload.password = form.password;
      await api.put("/auth/profile", payload);
      toast.success("Profile updated");
      setForm({ name: "", email: "", password: "", confirm: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <div className="card">
          <h3 className="text-base font-semibold text-textMain dark:text-white mb-5">Update Profile</h3>
          <div className="space-y-3">
            <div className="form-group">
              <label className="label">Name</label>
              <input className="input" placeholder="New name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="New email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">New Password</label>
              <input type="password" className="input" placeholder="Leave blank to keep" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">Confirm Password</label>
              <input type="password" className="input" placeholder="Confirm new password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} />
            </div>
            <button onClick={handleSave} className="btn-primary flex items-center gap-2">
              <Save size={14}/> Save Changes
            </button>
          </div>
        </div>

        {/* Theme */}
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
              <span className="text-sm">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}