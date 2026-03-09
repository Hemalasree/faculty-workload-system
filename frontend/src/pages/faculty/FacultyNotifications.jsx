import { useEffect, useState } from "react";
import { Bell, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../api/api";
import React from "react";

export default function FacultyNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, []);
  const load = () => api.get("/notifications").then(r => setNotifications(r.data.data || []));

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      load();
    } catch {}
  };

  const markAll = async () => {
    const unread = notifications.filter(n => !n.is_read);
    await Promise.all(unread.map(n => api.put(`/notifications/${n.id}/read`).catch(() => {})));
    load();
    toast.success("All marked as read");
  };

  const filtered = filter === "unread" ? notifications.filter(n => !n.is_read) : notifications;
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {["all","unread"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? "bg-white dark:bg-cardDark shadow-sm text-primary" : "text-textMuted"}`}>
                {f === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAll} className="btn-ghost text-primary flex items-center gap-1">
              <CheckCircle size={14}/> Mark all read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filtered.map(n => (
            <div key={n.id}
              className={`card transition-all ${!n.is_read ? "border-primary/30 bg-primary/5 dark:bg-primary/10" : ""}`}
              onClick={() => !n.is_read && markRead(n.id)}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.priority === "URGENT" ? "bg-red-100 dark:bg-red-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}>
                  <Bell size={16} className={n.priority === "URGENT" ? "text-red-500" : "text-primary"} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-textMain dark:text-white">{n.title}</p>
                      {n.priority === "URGENT" && <span className="badge-red ml-2">Urgent</span>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"/>}
                      <span className="text-xs text-textMuted">{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm text-textMuted mt-1">{n.message}</p>
                  {!n.is_read && <p className="text-xs text-primary mt-2 cursor-pointer hover:underline" onClick={() => markRead(n.id)}>Mark as read</p>}
                </div>
              </div>
            </div>
          ))}
          {!filtered.length && (
            <div className="card text-center py-12 text-textMuted">
              <Bell size={32} className="mx-auto mb-2 opacity-30"/>
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}